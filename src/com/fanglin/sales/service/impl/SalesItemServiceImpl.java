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

	@Override
	public List<SalesItemVO> querySalesItemBySid(SalesVO salesVO) {

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesVO.getSid());

		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();

		for (SalesItemPO salesItemPO : salesItemPOs) {

			SalesItemVO salesItemVO = new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO());

			BeanUtil.copyProperties(salesItemPO, salesItemVO, Arrays.asList("goods", "color", "format"));
			BeanUtil.copyProperties(salesItemPO.getGoods(), salesItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(salesItemPO.getColor(), salesItemVO.getColor());
			BeanUtil.copyProperties(salesItemPO.getFormat(), salesItemVO.getFormat());

			salesItemVOs.add(salesItemVO);
		}

		return salesItemVOs;
	}

	@Override
	public List<SalesItemVO> querySalesItemBySids(List<Long> sids) {

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySids(sids);
		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();

		for (SalesItemPO salesItemPO : salesItemPOs) {

			SalesItemVO salesItemVO = new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO());

			BeanUtil.copyProperties(salesItemPO, salesItemVO, Arrays.asList("goods", "color", "format"));
			BeanUtil.copyProperties(salesItemPO.getGoods(), salesItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(salesItemPO.getColor(), salesItemVO.getColor());
			BeanUtil.copyProperties(salesItemPO.getFormat(), salesItemVO.getFormat());

			salesItemVOs.add(salesItemVO);
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

		SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(salesItemVO.getGoods().getGid()), new ColorPO(salesItemVO.getColor().getCid()), new FormatPO(salesItemVO.getFormat().getFid()));

		BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods", "color", "format"));

		salesItemPO.setSid(salesVO.getSid());
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
