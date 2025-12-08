package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.GoodsPackageDao;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.GoodsPackagePO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesItemService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("salesItemService")
@Transactional(readOnly = true)
public class SalesItemServiceImpl implements SalesItemService {

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private GoodsPackageDao goodsPackageDao;

	@Override
	public List<SalesItemVO> querySalesItemBySid(SalesVO salesVO) {

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesVO.getSid());
		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();

		for (SalesItemPO salesItemPO : salesItemPOs) {
			salesItemVOs.add(salesItemPO.ptv(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO())));
		}

		return salesItemVOs;
	}

	@Override
	public List<SalesItemVO> querySalesItemBySids(List<Long> sids) {

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySids(sids);
		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();

		for (SalesItemPO salesItemPO : salesItemPOs) {
			salesItemVOs.add(salesItemPO.ptv(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO())));
		}

		return salesItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesItem(SalesVO salesVO, SalesItemVO salesItemVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesItemVO.getGoods() == null || salesItemVO.getGoods().getGid() == null) {
			throw new FLException(260004, "商品不存在");
		}

		GoodsPO goodsPO = goodsDao.get(salesItemVO.getGoods().getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		if (salesItemVO.getColor() == null || salesItemVO.getColor().getCid() == null) {
			throw new FLException(260014, "颜色不存在");
		}
		if (salesItemVO.getFormat() == null || salesItemVO.getFormat().getFid() == null) {
			throw new FLException(260015, "规格不存在");
		}

		SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(salesItemVO.getGoods().getGid()), new ColorPO(salesItemVO.getColor().getCid()), new FormatPO(salesItemVO.getFormat().getFid()));

		BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods", "color", "format"));

		salesItemPO.setSid(salesVO.getSid());
		salesItemPO.setType(goodsPO.getType());
		salesItemPO.setInitnum(salesItemVO.getNum());
		salesItemPO.setPunum(salesItemVO.getNum());
		salesItemPO.setXgnum(salesItemVO.getNum());

		salesPO.setOtherStatus(salesVO.getOtherStatus());

		salesItemDao.save(salesItemPO);

		if (salesVO.getTotal() != Arith.add(salesPO.getTotal(), salesItemVO.getTotal())) {
			throw new FLException(260059, "销售单总额不必配");
		}

		salesPO.setTotal(salesVO.getTotal());
		salesPO.setAmount(salesVO.getTotal());

		salesDao.update(salesPO);

		salesItemVO.setSiid(salesItemPO.getSiid());

		if (goodsPO == null || goodsPO.getType() != GoodsPO.TYPE_SUIT_INT) return 0;

		// 套餐类型商品，需要展开套餐明细
		List<GoodsPackagePO> goodsPackages = goodsPackageDao.queryGoodsPackage(goodsPO.getGid());

		if (goodsPackages == null || goodsPackages.isEmpty()) return 0;

		for (GoodsPackagePO goodsPackagePO : goodsPackages) {

			SalesItemPO salesItemGP = new SalesItemPO(goodsPackagePO.getGoods(), goodsPackagePO.getColor(), goodsPackagePO.getFormat());

			BeanUtil.copyProperties(goodsPackagePO, salesItemGP, Arrays.asList("goods", "color", "format"));

			// 复制价格等基本信息
			salesItemGP.setSid(salesPO.getSid());
			salesItemGP.setPsiid(salesItemPO.getSiid()); // 关联父销售项
			salesItemGP.setType(SalesItemPO.TYPE_PACKAGE_INT); // 标记为套餐明细

			salesItemGP.setPurchase(goodsPackagePO.getPurchase());
			salesItemGP.setSelling(goodsPackagePO.getSelling());
			salesItemGP.setDiscount(1000);
			salesItemGP.setDisPrice(goodsPackagePO.getSelling());
			salesItemGP.setPostDis(1000);
			salesItemGP.setPrice(goodsPackagePO.getSelling());

			long num = Arith.mul(salesItemPO.getNum(), goodsPackagePO.getNum());

			salesItemGP.setInitnum(goodsPackagePO.getNum());
			salesItemGP.setPunum(num);
			salesItemGP.setXgnum(num);

			salesItemGP.setTotal(Arith.mul(num, goodsPackagePO.getSelling()));

			salesItemDao.save(salesItemGP);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesItem(SalesVO salesVO, SalesItemVO salesItemVO) throws FLException {

		SalesItemPO salesItemPO = salesItemDao.get(salesItemVO.getSiid());

		if (salesItemPO == null) {
			throw new FLException(260023, "销售项不存在");
		}

		SalesPO salesPO = salesDao.get(salesItemPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setTotal(salesVO.getTotal());
		salesPO.setAmount(salesVO.getTotal());

		salesItemPO.setNum(salesItemVO.getNum());
		salesItemPO.setInitnum(salesItemVO.getNum());
		salesItemPO.setPunum(salesItemVO.getNum());
		salesItemPO.setXgnum(salesItemVO.getNum());
		salesItemPO.setTotal(salesItemVO.getTotal());
		salesItemPO.setComment(salesItemVO.getComment());

		salesItemDao.update(salesItemPO);

		salesDao.update(salesPO);

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemByPsiid(salesItemPO.getSiid());

		if (salesItemPOs == null || salesItemPOs.isEmpty()) return 0;

		for (SalesItemPO salesItemGP : salesItemPOs) {

			long num = Arith.mul(salesItemPO.getNum(), salesItemGP.getInitnum());

			salesItemGP.setNum(num);
			salesItemGP.setPunum(num);
			salesItemGP.setXgnum(num);

			salesItemGP.setTotal(Arith.mul(num, salesItemGP.getSelling()));

			salesItemDao.save(salesItemGP);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesItemForBalance(SalesItemVO salesItemVO) throws FLException {

		SalesItemPO salesItemPO = salesItemDao.get(salesItemVO.getSiid());

		if (salesItemPO == null) {
			throw new FLException(260023, "销售项不存在");
		}

		SalesPO salesPO = salesDao.get(salesItemPO.getSid());

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_CONFIRM_SHORT) {
			throw new FLException(260045, "销售项状态不可操作");
		}

		if (salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT) {
			throw new FLException(260045, "销售项状态不可操作");
		}

		salesItemPO.setCtype(salesItemVO.getCtype());
		salesItemPO.setCvalue(salesItemVO.getCvalue());

		salesItemDao.update(salesItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSalesItem(SalesVO salesVO, SalesItemVO salesItemVO) throws FLException {

		SalesItemPO salesItemPO = salesItemDao.get(salesItemVO.getSiid());

		if (salesItemPO == null) {
			throw new FLException(260023, "销售项不存在");
		}

		SalesPO salesPO = salesDao.get(salesItemPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setTotal(salesVO.getTotal());
		salesPO.setAmount(salesVO.getTotal());

		salesDao.update(salesPO);

		salesItemDao.delete(salesItemPO);
		salesItemDao.deleteSalesItemByPsiid(salesItemPO.getSiid());

		return 0;
	}
}
