package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesDeliveryItemDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesDeliveryService;
import com.fanglin.sales.vo.SalesDeliveryItemVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("salesDeliveryService")
@Transactional(readOnly = true)
public class SalesDeliveryServiceImpl implements SalesDeliveryService {

	@Autowired
	private SalesDeliveryItemDao salesDeliveryItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Override
	public void pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company, SalesDeliveryItemVO salesDeliveryItemVO) {

		salesDeliveryItemVO.filter(filters);

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.pageSalesDeliveryItem(paging, filters, company);
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = ptv(salesDeliveryItemPOs);

		paging.setData(salesDeliveryItemVOs);
	}

	@Override
	public void pageSalesDeliveryItemForSupplier(Paging paging, List<Filter> filters, String userId, int queryCompany) {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.pageSalesDeliveryItem(paging, filters, queryCompany, userPO.getUid());
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = ptv(salesDeliveryItemPOs);

		paging.setData(salesDeliveryItemVOs);
	}

	@Override
	public List<SalesDeliveryItemVO> querySalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItemVO) {

		List<SalesDeliveryItemPO> salesDeliveryItemPOs = salesDeliveryItemDao.querySalesDeliveryItem(salesDeliveryItemVO.getSales().getSid());
		List<SalesDeliveryItemVO> salesDeliveryItemVOs = ptv(salesDeliveryItemPOs);

		return salesDeliveryItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void tranSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException {

		SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItem.getSdiid());

		if (salesDeliveryItemPO == null) {
			throw new FLException(260065, "配送项不存在");
		}

		if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_INIT_INT) {
			throw new FLException(260066, "配送项状态不可操作");
		}

		UserPO traner = userDao.queryUserByUserId(userId);

		salesDeliveryItemPO.setTraner(traner);
		salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_TRAN_INT);
		salesDeliveryItemPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));

		salesDeliveryItemDao.update(salesDeliveryItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException {

		SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItem.getSdiid());

		if (salesDeliveryItemPO == null) {
			throw new FLException(260065, "配送项不存在");
		}

		if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_TRAN_INT) {
			throw new FLException(260066, "配送项状态不可操作");
		}

		UserPO checker = userDao.queryUserByUserId(userId);

		salesDeliveryItemPO.setChecker(checker);
		salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_CHECK_INT);
		salesDeliveryItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

		salesDeliveryItemDao.update(salesDeliveryItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException {

		SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItem.getSdiid());

		if (salesDeliveryItemPO == null) {
			throw new FLException(260065, "配送项不存在");
		}

		if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_CHECK_INT) {
			throw new FLException(260066, "配送项状态不可操作");
		}

		UserPO confirmer = userDao.queryUserByUserId(userId);

		salesDeliveryItemPO.setConfirmer(confirmer);
		salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_CONFIRM_INT);
		salesDeliveryItemPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

		salesDeliveryItemDao.update(salesDeliveryItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException {

		SalesDeliveryItemPO salesDeliveryItemPO = salesDeliveryItemDao.get(salesDeliveryItem.getSdiid());

		if (salesDeliveryItemPO == null) {
			throw new FLException(260065, "配送项不存在");
		}

		if (salesDeliveryItemPO.getStatus() != SalesDeliveryItemPO.STATUS_CONFIRM_INT) {
			throw new FLException(260066, "配送项状态不可操作");
		}

		UserPO finisher = userDao.queryUserByUserId(userId);

		salesDeliveryItemPO.setFinisher(finisher);
		salesDeliveryItemPO.setStatus(SalesDeliveryItemPO.STATUS_FINISH_INT);
		salesDeliveryItemPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		salesDeliveryItemDao.update(salesDeliveryItemPO);
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

		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesDeliveryItem.getSales().getSid());

		for (SalesItemPO salesItemPO : salesItemPOs) {

			if (salesDeliveryItemDao.querySalesDeliveryItemBySiid(salesItemPO.getSiid()) != null) {
				continue;
			}

			SalesDeliveryItemPO salesDeliveryItemPO = new SalesDeliveryItemPO();

			salesDeliveryItemPO.setSalesItem(salesItemPO);
			salesDeliveryItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesDeliveryItemPO.setCompany(salesPO.getDompany());
			salesDeliveryItemPO.setSales(salesPO);

			salesDeliveryItemDao.save(salesDeliveryItemPO);
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

	private List<SalesDeliveryItemVO> ptv(List<SalesDeliveryItemPO> salesDeliveryItemPOs) {

		List<SalesDeliveryItemVO> salesDeliveryItemVOs = new ArrayList<SalesDeliveryItemVO>();

		for (SalesDeliveryItemPO salesDeliveryItemPO : salesDeliveryItemPOs) {

			SalesDeliveryItemVO salesDeliveryItemVO = new SalesDeliveryItemVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO()), new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()));

			BeanUtil.copyPropertie(salesDeliveryItemPO, salesDeliveryItemVO, Arrays.asList("sales", "salesItem", "traner", "checker", "confirmer", "finisher", "balancer"));
			if (salesDeliveryItemPO.getTraner() != null) {
				BeanUtil.copyProperties(salesDeliveryItemPO.getTraner(), salesDeliveryItemVO.getTraner(), Arrays.asList("dept", "duty"));
				BeanUtil.copyProperties(salesDeliveryItemPO.getTraner().getDept(), salesDeliveryItemVO.getTraner().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			}

			if (salesDeliveryItemPO.getChecker() != null) {
				BeanUtil.copyProperties(salesDeliveryItemPO.getChecker(), salesDeliveryItemVO.getChecker(), Arrays.asList("dept", "duty"));
				BeanUtil.copyProperties(salesDeliveryItemPO.getChecker().getDept(), salesDeliveryItemVO.getChecker().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			}

			if (salesDeliveryItemPO.getConfirmer() != null) {
				BeanUtil.copyProperties(salesDeliveryItemPO.getConfirmer(), salesDeliveryItemVO.getConfirmer(), Arrays.asList("dept", "duty"));
				BeanUtil.copyProperties(salesDeliveryItemPO.getConfirmer().getDept(), salesDeliveryItemVO.getConfirmer().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			}

			if (salesDeliveryItemPO.getFinisher() != null) {
				BeanUtil.copyProperties(salesDeliveryItemPO.getFinisher(), salesDeliveryItemVO.getFinisher(), Arrays.asList("dept", "duty"));
				BeanUtil.copyProperties(salesDeliveryItemPO.getFinisher().getDept(), salesDeliveryItemVO.getFinisher().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			}

			BeanUtil.copyPropertie(salesDeliveryItemPO.getSalesItem(), salesDeliveryItemVO.getSalesItem(), Arrays.asList("goods", "color", "format"));
			BeanUtil.copyPropertie(salesDeliveryItemPO.getSalesItem().getGoods(), salesDeliveryItemVO.getSalesItem().getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyPropertie(salesDeliveryItemPO.getSalesItem().getColor(), salesDeliveryItemVO.getSalesItem().getColor());
			BeanUtil.copyPropertie(salesDeliveryItemPO.getSalesItem().getFormat(), salesDeliveryItemVO.getSalesItem().getFormat());

			BeanUtil.copyPropertie(salesDeliveryItemPO.getSales(), salesDeliveryItemVO.getSales(), Arrays.asList("salesman", "dept", "region", "guider", "instorer", "guideDept", "house", "customer", "supplier", "finisher"));
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getInstorer(), salesDeliveryItemVO.getSales().getInstorer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getGuider(), salesDeliveryItemVO.getSales().getGuider(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getGuideDept(), salesDeliveryItemVO.getSales().getGuideDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getHouse(), salesDeliveryItemVO.getSales().getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getHouse().getVillage(), salesDeliveryItemVO.getSales().getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getCustomer(), salesDeliveryItemVO.getSales().getCustomer());
			BeanUtil.copyProperties(salesDeliveryItemPO.getSales().getFinisher(), salesDeliveryItemVO.getSales().getFinisher(), Arrays.asList("dept", "duty"));

			if (salesDeliveryItemPO.getSales().getSupplier() != null) {
				BeanUtil.copyPropertie(salesDeliveryItemPO.getSales().getSupplier(), salesDeliveryItemVO.getSales().getSupplier(), Arrays.asList("dept", "duty"));
			}

			salesDeliveryItemVOs.add(salesDeliveryItemVO);
		}

		return salesDeliveryItemVOs;
	}

}
