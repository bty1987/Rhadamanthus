package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.SerializationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.SalesDeliveryStatusRightDao;
import com.fanglin.right.po.SalesDeliveryStatusRightPO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesDeliveryDao;
import com.fanglin.sales.dao.SalesDeliveryItemDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.sales.po.SalesDeliveryPO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesDeliveryService;
import com.fanglin.sales.vo.SalesDeliveryItemVO;
import com.fanglin.sales.vo.SalesDeliveryVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("salesDeliveryService")
@Transactional(readOnly = true)
public class SalesDeliveryServiceImpl implements SalesDeliveryService {

	@Autowired
	private SalesDeliveryDao salesDeliveryDao;

	@Autowired
	private SalesDeliveryItemDao salesDeliveryItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Autowired
	private SalesDeliveryStatusRightDao salesDeliveryStatusRightDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Override
	public void pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company, List<Short> statuses) throws FLException {

		filters.add(new Filter("statuses", statuses, "in", Filter.RANGE_TYPE_SHORT_INT));

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.pageSalesDeliveryItem(paging, filters, company);
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = new ArrayList<SalesDeliveryItemVO>();

		for (SalesDeliveryItemPO salesDeliveryItemPO : salesDeliveryItemPOs) {
			salesDeliveryItemVOs.add(salesDeliveryItemPO.ptv(new SalesDeliveryItemVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		paging.setData(salesDeliveryItemVOs);
	}

	@Override
	public void pageSalesDeliveryItemForSupplier(Paging paging, List<Filter> filters, String userId, int queryCompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.pageSalesDeliveryItem(paging, filters, queryCompany, userPO.getUid());
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = new ArrayList<SalesDeliveryItemVO>();

		for (SalesDeliveryItemPO salesDeliveryItemPO : salesDeliveryItemPOs) {
			salesDeliveryItemVOs.add(salesDeliveryItemPO.ptv(new SalesDeliveryItemVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		paging.setData(salesDeliveryItemVOs);
	}

	@Override
	public void pageSalesDeliveryItemForInstorer(Paging paging, List<Filter> filters, String userId, int queryCompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.pageSalesDeliveryItemForInstorer(paging, filters, queryCompany, userPO.getUid());
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = new ArrayList<SalesDeliveryItemVO>();

		for (SalesDeliveryItemPO salesDeliveryItemPO : salesDeliveryItemPOs) {
			salesDeliveryItemVOs.add(salesDeliveryItemPO.ptv(new SalesDeliveryItemVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		paging.setData(salesDeliveryItemVOs);
	}

	@Override
	public List<SalesDeliveryItemVO> querySalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItemVO) {

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.querySalesDeliveryItem(salesDeliveryItemVO.getSales().getSid());
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = new ArrayList<SalesDeliveryItemVO>();

		for (SalesDeliveryItemPO salesDeliveryItemPO : salesDeliveryItemPOs) {
			salesDeliveryItemVOs.add(salesDeliveryItemPO.ptv(new SalesDeliveryItemVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		return salesDeliveryItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void tranSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException {

		UserPO traner = userDao.queryUserByUserId(userId);

		for (SalesDeliveryItemVO salesDeliveryItemVO : salesDeliveryItems) {

			SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItemVO.getSdiid());

			if (salesDeliveryItemPO == null) continue;
			if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_INIT_INT) continue;

			salesDeliveryItemPO.setTraner(traner);
			salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_TRAN_INT);
			salesDeliveryItemPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			List<SalesDeliveryStatusRightPO> rights = salesDeliveryStatusRightDao.querySalesDeliveryStatusRight(salesDeliveryItemPO.getSales().getBrand().getBid());

			if (rights != null && rights.size() != 0) {
				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_TRAN_INT, traner);
			}

			salesDeliveryItemDao.update(salesDeliveryItemPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException {

		UserPO checker = userDao.queryUserByUserId(userId);

		for (SalesDeliveryItemVO salesDeliveryItemVO : salesDeliveryItems) {

			SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItemVO.getSdiid());

			if (salesDeliveryItemPO == null) continue;
			if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_TRAN_INT) continue;

			salesDeliveryItemPO.setChecker(checker);
			salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_CHECK_INT);
			salesDeliveryItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			List<SalesDeliveryStatusRightPO> rights = salesDeliveryStatusRightDao.querySalesDeliveryStatusRight(salesDeliveryItemPO.getSales().getBrand().getBid());

			if (rights != null && rights.size() != 0) {
				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_CHECK_INT, checker);
			}

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			salesBalanceDao.updateSalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.ONETYPE_INIT_INT, "verifyStatus", SalesBalancePO.DELIVERSTATUS_PART_INT);

			if (salesDeliveryItemDao.countSalesDeliveryItem(salesDeliveryItemPO.getSales().getSid(), SalesDeliveryItemPO.STATUS_CHECK_INT) == 0) {
				salesBalanceDao.updateSalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.ONETYPE_INIT_INT, "verifyStatus", SalesBalancePO.DELIVERSTATUS_ALL_INT);
			}

		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException {

		UserPO confirmer = userDao.queryUserByUserId(userId);

		for (SalesDeliveryItemVO salesDeliveryItemVO : salesDeliveryItems) {

			SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItemVO.getSdiid());

			if (salesDeliveryItemPO == null) continue;
			if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_CHECK_INT) continue;

			salesDeliveryItemPO.setConfirmer(confirmer);
			salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_CONFIRM_INT);
			salesDeliveryItemPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			List<SalesDeliveryStatusRightPO> rights = salesDeliveryStatusRightDao.querySalesDeliveryStatusRight(salesDeliveryItemPO.getSales().getBrand().getBid());

			if (rights != null && rights.size() != 0) {
				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_CONFIRM_INT, confirmer);
			}

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			salesBalanceDao.updateSalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.ONETYPE_INIT_INT, "confirmStatus", SalesBalancePO.DELIVERSTATUS_PART_INT);

			if (salesDeliveryItemDao.countSalesDeliveryItem(salesDeliveryItemPO.getSales().getSid(), SalesDeliveryItemPO.STATUS_CONFIRM_INT) == 0) {
				salesBalanceDao.updateSalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.ONETYPE_INIT_INT, "confirmStatus", SalesBalancePO.DELIVERSTATUS_ALL_INT);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException {

		UserPO finisher = userDao.queryUserByUserId(userId);

		for (SalesDeliveryItemVO salesDeliveryItemVO : salesDeliveryItems) {

			SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItemVO.getSdiid());

			if (salesDeliveryItemPO == null) continue;
			if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_CONFIRM_INT) continue;

			salesDeliveryItemPO.setFinisher(finisher);
			salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_FINISH_INT);
			salesDeliveryItemPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			List<SalesDeliveryStatusRightPO> rights = salesDeliveryStatusRightDao.querySalesDeliveryStatusRight(salesDeliveryItemPO.getSales().getBrand().getBid());

			if (rights != null && rights.size() != 0) {
				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_FINISH_INT, finisher);
			}

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();

			salesBalanceDao.updateSalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.ONETYPE_INIT_INT, "deliverStatus", SalesBalancePO.DELIVERSTATUS_PART_INT);

			if (salesDeliveryItemDao.countSalesDeliveryItem(salesDeliveryItemPO.getSales().getSid(), SalesDeliveryItemPO.STATUS_FINISH_INT) == 0) {
				salesBalanceDao.updateSalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.ONETYPE_INIT_INT, "deliverStatus", SalesBalancePO.DELIVERSTATUS_ALL_INT);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deliveSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException {

		SalesPO salesPO = salesDao.get(salesDeliveryItem.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (!Arrays.asList(SalesPO.STATUS_INIT_SHORT, SalesPO.STATUS_END_SHORT).contains(salesPO.getStatus())) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (!Arrays.asList(SalesPO.FULLPAYSTATUS_PAYED_SHORT, SalesPO.FULLPAYSTATUS_CONFIRM_SHORT).contains(salesPO.getFullpayStatus())) {
			throw new FLException(260045, "销售项状态不可操作");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		SalesDeliveryPO salesDeliveryPO = salesDeliveryDao.querySalesDelivery(salesPO.getSid());

		if (salesDeliveryPO == null) {

			salesDeliveryPO = new SalesDeliveryPO();

			salesDeliveryPO.setSales(salesPO);
			salesDeliveryPO.setCreater(creater);
			salesDeliveryPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesDeliveryPO.setCompany(salesPO.getCompany());

			salesDeliveryDao.save(salesDeliveryPO);
		}

		salesDeliveryDao.flush();

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesDeliveryItem.getSales().getSid());

		List<SalesDeliveryStatusRightPO> rights = salesDeliveryStatusRightDao.querySalesDeliveryStatusRight(salesPO.getBrand().getBid());

		for (SalesItemPO salesItemPO : salesItemPOs) {

			if (salesDeliveryItemDao.querySalesDeliveryItemBySiid(salesItemPO.getSiid()) != null) continue;

			SalesDeliveryItemPO salesDeliveryItemPO = new SalesDeliveryItemPO();

			salesDeliveryItemPO.setSalesItem(salesItemPO);
			salesDeliveryItemPO.setCreater(creater);
			salesDeliveryItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesDeliveryItemPO.setCompany(salesPO.getDompany());
			salesDeliveryItemPO.setSales(salesPO);

			salesDeliveryItemPO.setProtranTime(salesDeliveryPO.getCreateTime());

			salesDeliveryItemDao.save(salesDeliveryItemPO);

			if (rights != null && rights.size() != 0) {
				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_INIT_INT, creater);
			}

			salesDeliveryItemDao.update(salesDeliveryItemPO);
			salesDeliveryItemDao.flush();
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem) throws FLException {

		SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItem.getSdiid());

		SalesPO salesPO = salesDao.get(salesDeliveryItemPO.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesDeliveryItemPO.setProtranTime(salesDeliveryItem.getProtranTime());

		salesDeliveryItemPO.setComment(salesDeliveryItem.getComment());

		salesDeliveryItemDao.update(salesDeliveryItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deliveSalesDelivery(SalesDeliveryVO salesDelivery, String userId) throws FLException {

		if (salesDelivery == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesDelivery.getSales() == null) {
			throw new FLException(260021, "销售单不存在");
		}

		SalesPO salesPO = salesDao.get(salesDelivery.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesDeliveryDao.countSalesDelivery(salesPO.getSid()) != 0) return;

		UserPO creater = userDao.queryUserByUserId(userId);

		SalesDeliveryPO salesDeliveryPO = new SalesDeliveryPO();

		salesDeliveryPO.setSales(salesPO);
		salesDeliveryPO.setCreater(creater);
		salesDeliveryPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesDeliveryPO.setPeliveryTime(DateUtil.getDateToTimestamp(new Date()));
		salesDeliveryPO.setCompany(salesPO.getCompany());

		if (salesDelivery.getPeliveryTime() != null) {
			salesDeliveryPO.setPeliveryTime(salesDelivery.getPeliveryTime());
		}

		salesDeliveryDao.save(salesDeliveryPO);
	}

	private void checkSalesDeliveryItem(SalesDeliveryItemPO salesDeliveryItemPO, List<SalesDeliveryStatusRightPO> rights, Short status, UserPO userPO) {

		List<Short> statuses = new ArrayList<Short>();

		for (SalesDeliveryStatusRightPO salesDeliveryStatusRightPO : rights) {
			if (salesDeliveryStatusRightPO.getChecked() == SalesDeliveryStatusRightPO.CHECKED_CHECK_INT) statuses.add(salesDeliveryStatusRightPO.getStatus());
		}

		balanceSalesDeliveryItem(salesDeliveryItemPO, rights, status, userPO);

		if (!statuses.contains(status)) return;

		switch (status) {
			case SalesDeliveryItemPO.STATUS_INIT_INT:

				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_TRAN_INT, userPO);

				break;
			case SalesDeliveryItemPO.STATUS_TRAN_INT:

				salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_TRAN_INT);
				salesDeliveryItemPO.setTraner(userPO);
				salesDeliveryItemPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));

				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_CHECK_INT, userPO);

				break;
			case SalesDeliveryItemPO.STATUS_CHECK_INT:

				salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_CHECK_INT);
				salesDeliveryItemPO.setChecker(userPO);
				salesDeliveryItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_CONFIRM_INT, userPO);

				break;
			case SalesDeliveryItemPO.STATUS_CONFIRM_INT:

				salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_CONFIRM_INT);
				salesDeliveryItemPO.setConfirmer(userPO);
				salesDeliveryItemPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

				checkSalesDeliveryItem(salesDeliveryItemPO, rights, SalesDeliveryItemPO.STATUS_FINISH_INT, userPO);

				break;
			case SalesDeliveryItemPO.STATUS_FINISH_INT:

				salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_FINISH_INT);
				salesDeliveryItemPO.setFinisher(userPO);
				salesDeliveryItemPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

				break;
		}
	}

	private void balanceSalesDeliveryItem(SalesDeliveryItemPO salesDeliveryItemPO, List<SalesDeliveryStatusRightPO> rights, Short status, UserPO userPO) {

		SalesDeliveryStatusRightPO salesDeliveryStatusRightBO = null;

		for (SalesDeliveryStatusRightPO salesDeliveryStatusRightPO : rights) {
			if (salesDeliveryStatusRightPO.getStatus() == status) salesDeliveryStatusRightBO = salesDeliveryStatusRightPO;
		}

		if (salesDeliveryStatusRightBO == null) return;
		if (salesDeliveryStatusRightBO.getCrate() == 0) return;

		SalesBalancePO salesBalancePO = salesBalanceDao.querySalesBalance(salesDeliveryItemPO.getSales().getSid(), SalesBalancePO.TYPE_BALANCE_INT, SalesBalancePO.ONETYPE_INIT_INT);

		if (salesBalancePO == null) return;

		SalesBalancePO salesBalanceCO = SerializationUtils.clone(salesBalancePO);

		salesBalanceCO.setType(SalesBalancePO.TYPE_INIT_INT);

		int rate = salesDeliveryStatusRightBO.getCrate();

		salesBalanceCO.setAllowance(Arith.mul(salesBalancePO.getAllowance(), rate));
		salesBalanceCO.setBalance(Arith.mul(salesBalancePO.getBalance(), rate));
		salesBalanceCO.setVbalance(Arith.mul(salesBalancePO.getVbalance(), rate));
		salesBalanceCO.setPbalance(Arith.mul(salesBalancePO.getPbalance(), rate));
		salesBalanceCO.setDifference(Arith.mul(salesBalancePO.getDifference(), rate));
		salesBalanceCO.setRate(rate);

		salesBalanceDao.save(salesBalanceCO);
	}

}
