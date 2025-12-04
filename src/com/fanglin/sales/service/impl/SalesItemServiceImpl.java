package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.GoodsPackagePO;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.GoodsPackageDao;
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
		if (salesItemVO.getColor() == null || salesItemVO.getColor().getCid() == null) {
			throw new FLException(260014, "颜色不存在");
		}
		if (salesItemVO.getFormat() == null || salesItemVO.getFormat().getFid() == null) {
			throw new FLException(260015, "规格不存在");
		}

		SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(salesItemVO.getGoods().getGid()), new ColorPO(salesItemVO.getColor().getCid()), new FormatPO(salesItemVO.getFormat().getFid()));

		BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods", "color", "format"));

		salesItemPO.setSid(salesVO.getSid());
		salesItemPO.setInitnum(salesItemVO.getNum());
		salesItemPO.setPunum(salesItemVO.getNum());
		salesItemPO.setXgnum(salesItemVO.getNum());
		salesPO.setOtherStatus(salesVO.getOtherStatus());

		salesItemDao.save(salesItemPO);

		// 检查商品是否为套餐类型
		GoodsPO goodsPO = goodsDao.get(salesItemVO.getGoods().getGid());
		if (goodsPO != null && goodsPO.getType() == GoodsPO.TYPE_SUIT_INT) {
			// 套餐类型商品，需要展开套餐明细
			List<GoodsPackagePO> goodsPackages = goodsPackageDao.queryPackage(goodsPO.getGid());

			if (goodsPackages != null && !goodsPackages.isEmpty()) {
				for (GoodsPackagePO goodsPackagePO : goodsPackages) {
					// 为每个套餐明细创建子销售项
					SalesItemPO childSalesItemPO = new SalesItemPO(
						goodsPackagePO.getGoods(),
						goodsPackagePO.getColor(),
						goodsPackagePO.getFormat()
					);

					// 复制价格等基本信息
					childSalesItemPO.setSid(salesVO.getSid());
					childSalesItemPO.setPsiid(salesItemPO.getSiid()); // 关联父销售项
					childSalesItemPO.setType((short) 1); // 标记为套餐明细

					// 计算子项数量 = 套餐数量 × 套餐明细数量
					long childNum = salesItemVO.getNum() * goodsPackagePO.getNum();
					childSalesItemPO.setNum(childNum);
					childSalesItemPO.setInitnum(childNum);
					childSalesItemPO.setPunum(childNum);
					childSalesItemPO.setXgnum(childNum);

					// 复制价格信息（如果套餐明细有价格配置）
					if (goodsPackagePO.getPurchase() > 0) {
						childSalesItemPO.setPurchase(goodsPackagePO.getPurchase());
					}
					if (goodsPackagePO.getSelling() > 0) {
						childSalesItemPO.setSelling(goodsPackagePO.getSelling());
					}
					if (goodsPackagePO.getConfine() > 0) {
						childSalesItemPO.setPrice(goodsPackagePO.getConfine());
					}
					childSalesItemPO.setCtype(goodsPackagePO.getCtype());
					childSalesItemPO.setCvalue(goodsPackagePO.getCvalue());

					// 计算子项总价
					if (childSalesItemPO.getPrice() > 0) {
						long childTotal = Arith.mul(childNum, childSalesItemPO.getPrice());
						childSalesItemPO.setTotal(childTotal);
					}

					// 保存子销售项
					salesItemDao.save(childSalesItemPO);
				}
			}
		}

		if (salesVO.getTotal() != Arith.add(salesPO.getTotal(), salesItemVO.getTotal())) {
			throw new FLException(260059, "销售单总额不必配");
		}

		salesPO.setTotal(salesVO.getTotal());
		salesPO.setAmount(salesVO.getTotal());

		salesDao.update(salesPO);

		salesItemVO.setSiid(salesItemPO.getSiid());

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

		return 0;
	}

}
