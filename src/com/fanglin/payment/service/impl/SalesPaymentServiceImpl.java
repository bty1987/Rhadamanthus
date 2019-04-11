package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.RefundsDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("salesPaymentService")
@Transactional(readOnly = true)
public class SalesPaymentServiceImpl implements SalesPaymentService {

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesReceiptDao salesReceiptDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationService decorationService;
	
	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private RefundsDao refundsDao;
	
	@Autowired
	private SalesItemDao salesItemDao;
	
	@Autowired
	private SalesBalanceService salesBalanceService;
	
	@Override
	public void pageSalesPaymentForInit(Paging paging, List<Filter> filters, int company) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT), "eq"));

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO());

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public void pageSalesPaymentForNotInit(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0)
			return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT), "ne"));

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForNotInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public void pageSalesPaymentForCollect(Paging paging, List<Filter> filters, int company) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT), "eq"));
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForCollect(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public void pageSalesPaymentForConfirm(Paging paging, List<Filter> filters, int company) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_SALES_STATUS_STR, String.valueOf(SalesPaymentPO.COLUMN_SALES_CONFIRMEDSTATUS_INT), "eq"));
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForCollect(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(salesPaymentVO.getSales().getSid());
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO());

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}

	@Override
	public List<SalesPaymentVO> querySalesPaymentByOrderId(SalesVO salesVO) {

		List<SalesPO> salesPOs = salesDao.querySalesByOrderId(salesVO.getOrderId());

		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		if (salesPOs == null || salesPOs.size() == 0) {
			return salesPaymentVOs;
		}

		List<Long> sids = new ArrayList<Long>();

		for (SalesPO sales : salesPOs) {
			sids.add(sales.getSid());
		}

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentBySids(sids);

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));

			salesPaymentVOs.add(salesPaymentVO);
		}

		return salesPaymentVOs;
	}

	@Override
	public List<SalesPaymentVO> querySalesPaymentForNotInitBySrid(SalesReceiptVO salesReceipt) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentForNotInitBySrid(salesReceipt.getSrId());

		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}
	
	//添加定金销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO, String cuid, int company) throws FLException {

		long sid = salesPaymentVO.getSales().getSid();
		
		SalesPO sales = salesDao.get(sid);

		if (sales == null) {
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPaymentVO.getReferMoney() < 0){
			throw new FLException(150025, "款项金额不正确");
		}
		
		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(sid);
		
		if(salesPaymentPOs.size() > 0){
			throw new FLException(150029, "款项不可提交");
		}

		if (sales.getStatus() != 0) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPaymentDao.countSalesPaymentBySidAType(salesPaymentVO.getSales().getSid(), SalesPaymentPO.COLUMN_DEPOSITTYPE_INT) > 0) {
			throw new FLException(150033, "款项类型已存在");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList("sales", "collecter", "confirmer"));
		salesPaymentPO.setSales(sales);
		salesPaymentPO.setType(SalesPaymentPO.COLUMN_DEPOSITTYPE_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
		salesPaymentPO.setCategory(sales.getCategory());
		salesPaymentPO.setBrand(sales.getBrand());
		
		UserPO userPO = userDao.queryUserByUserId(cuid);

		salesPaymentPO.setCreater(userPO);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setCompany(company);

		salesPaymentDao.save(salesPaymentPO);

		salesPaymentVO.setSpid(salesPaymentPO.getSpid());

		sales.setDepositpay(salesPaymentVO.getReferMoney());
		sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_UNPAY_SHORT);

		salesDao.update(sales);

		return 0;
	}
	
	//添加补款销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO, String cuid, int company) throws FLException {

		long sid = salesPaymentVO.getSales().getSid();
		
		SalesPO sales = salesDao.get(sid);

		if(salesPaymentDao.countSalesPaymentBySidAType(sid, SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		SalesPaymentPO depositSalesPaymentPO = salesPaymentDao.querySalesPaymentsBySidAndType(sid, SalesPaymentPO.COLUMN_DEPOSITTYPE_INT);
		
		if(depositSalesPaymentPO != null && depositSalesPaymentPO.getStatus() == SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
			throw new FLException(150041, "定金状态不可操作");
		}
		
		float couponValue = sales.getCoupon();
		float venderMalingValue = sales.getVenderMaling();
		float subSalesMoney = Arith.add(couponValue, venderMalingValue);
		float sumSalesMoney = Arith.add(depositSalesPaymentPO == null ? 0 : depositSalesPaymentPO.getReferMoney(), salesPaymentVO.getReferMoney());
		
		if(sales.getTotal() != Arith.add(subSalesMoney, sumSalesMoney)){
			throw new FLException(150017, "项目总额与款项额不符");
		}
		
		if(sales.getTotal() != salesItemDao.countSalesItemForAmount(sid)){
			throw new FLException(150017, "项目总额与款项额不符");
		}
		
		if (sales.getStatus() != 0) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList("sales", "collecter", "confirmer"));
		salesPaymentPO.setSales(sales);
		
		if(salesPaymentVO.getReferMoney() >= 0){
			salesPaymentPO.setType(SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT);
		}else if(salesPaymentVO.getReferMoney() < 0){
			salesPaymentPO.setType(SalesPaymentPO.COLUMN_MAKEAREFUNDTYPE_INT);
		}
		
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
		salesPaymentPO.setCategory(sales.getCategory());
		salesPaymentPO.setBrand(sales.getBrand());

		UserPO userPO = userDao.queryUserByUserId(cuid);

		salesPaymentPO.setCreater(userPO);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(Math.abs(salesPaymentVO.getReferMoney()));
		salesPaymentPO.setCompany(company);

		salesPaymentDao.save(salesPaymentPO);

		salesPaymentVO.setSpid(salesPaymentPO.getSpid());

		sales.setFullpay(salesPaymentVO.getReferMoney());
		sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_UNPAY_SHORT);

		salesDao.update(sales);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, String userId, Integer company) throws FLException {

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());
		
		if (salesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}
		
		if (salesPayment.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}
		
		SalesPO sales = salesPayment.getSales();

		if (sales == null) {
			throw new FLException(260021, "销售单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();

		salesReceiptPO.setCollecter(userPO);
		salesReceiptPO.setCollecterName(userPO.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));

		if (salesReceiptVO.getCash() != null && salesReceiptVO.getCash() != 0) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null && salesReceiptVO.getBank() != 0) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null && salesReceiptVO.getCheckv() != 0) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getCoupon() != null && salesReceiptVO.getCoupon() != 0) {
			
			String couponInfo = salesReceiptVO.getCouponInfo();
			String[] couponInfos = couponInfo.split("#");
			float sumCoupon = 0;
			
			for(int i = 0; i < couponInfos.length; i++){
				if(couponInfos[i].indexOf(":") > -1){
					sumCoupon = Arith.add(sumCoupon, Short.valueOf(couponInfos[i].split(":")[1]));
				}
			}
			
			if(sumCoupon != salesReceiptVO.getCoupon()){
				throw new FLException(150024, "券总金额与券统计金额不等");
			}
			
			salesReceiptPO.setCoupon(salesReceiptVO.getCoupon());
			salesReceiptPO.setCouponInfo(couponInfo);
		} else {
			salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCouponInfo("");
		}

		if (salesReceiptVO.getAdvance() != null && salesReceiptVO.getAdvance() != 0) {
			
			long cid = sales.getCustomer().getCid();
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(cid, sales.getCompany());
			
			if(advancePaymentPO == null){
				throw new FLException(150010, "预付款余额不足");
			}
			
			if(advancePaymentPO.getMaterialBalance() < salesReceiptVO.getAdvance()){
				throw new FLException(150010, "预付款余额不足");
			}
			
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_INT);
		}

		if (salesReceiptVO.getComment() != null)
			salesReceiptPO.setComment(salesReceiptVO.getComment());
		else {
			salesReceiptPO.setComment("");
		}

		salesReceiptPO.setType(SalesReceiptPO.COLUMN_SALESRECEIPT_TYPE_INT);

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getCoupon() + salesReceiptPO.getAdvance();
		Float referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);

		salesPayment.setSalesReceipt(salesReceiptPO);
		salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		
		if(sales.getPompany() == 0){
			salesPayment.setCompany(company);
			sales.setPompany(company);
		}else{
			salesPayment.setCompany(sales.getPompany());
		}
		
		salesPaymentDao.update(salesPayment);

		if (salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {
			sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);
			salesDao.update(sales);
		} else if (salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			sales.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			salesDao.update(sales);
		}

		if (salesPaymentVO.getAdvanceType() != null) {

			Short paymentType = 0;

			if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPECONTRACT_INT) {
				paymentType = 0; // 合同
			} else if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEENGINEERING_INT) {
				paymentType = 1; // 工程
			} else if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEMATERIAL_INT) {
				paymentType = 2; // 主材
			} else if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEZHENGLIN_INT) {
				paymentType = 3; // 正林
			}

			PaymentVO paymentVO = new PaymentVO();

			paymentVO.setOrderId(sales.getOrderId());
			paymentVO.setPaymentType(paymentType);
			paymentVO.setComment(String.format("销售单:%d", sales.getSid()));
			paymentVO.setTransfer(salesPaymentVO.getAdvance());
			paymentVO.setUniqueid("SA" + salesReceiptPO.getSrId());

			// 预付款付款
			paymentService.payPayment(paymentVO, userId);
		}
		
		decorationService.sendMessage(salesPayment.getSales().getOrderId(), "主材单", String.format("主材交款金额%s元", salesPayment.getReferMoney()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectSalesPayments(List<Long> spids, SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, String userId, Integer company) throws FLException {

		SalesPO sales = salesDao.get(salesPaymentVO.getSales().getSid());

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();

		salesReceiptPO.setCollecter(userPO);
		salesReceiptPO.setCollecterName(userPO.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		if (salesReceiptVO.getCash() != null && salesReceiptVO.getCash() != 0) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null && salesReceiptVO.getBank() != 0) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null && salesReceiptVO.getCheckv() != 0) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getAdvance() != null && salesReceiptVO.getAdvance() != 0) {
			
			long cid = sales.getCustomer().getCid();
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(cid, sales.getCompany());
			
			if(advancePaymentPO == null){
				throw new FLException(150010, "预付款余额不足");
			}
			
			if(advancePaymentPO.getMaterialBalance() < salesReceiptVO.getAdvance()){
				throw new FLException(150010, "预付款余额不足");
			}
			
			salesReceiptPO.setAdvance(salesReceiptVO.getAdvance());
			salesReceiptPO.setAdvanceType(salesReceiptVO.getAdvanceType());
		} else {
			salesReceiptPO.setAdvance(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setAdvanceType(SalesReceiptPO.COLUMN_ADVANCETYPE_INT);
		}

		if (salesReceiptVO.getComment() != null)
			salesReceiptPO.setComment(salesReceiptVO.getComment());
		else {
			salesReceiptPO.setComment("");
		}

		salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_COUPON_INT);
		salesReceiptPO.setCouponInfo("");

		salesReceiptPO.setType(SalesReceiptPO.COLUMN_SALESRECEIPT_TYPE_INT);

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getAdvance();

		Float referMoneyPY = 0f;

		for (Long spid : spids) {
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);

			if (salesPayment.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT) {
				throw new FLException(150036, "款项状态不可操作");
			}

			referMoneyPY = referMoneyPY + salesPayment.getReferMoney();
		}

		if (Arith.sub(referMoneySR, referMoneyPY) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}

		salesReceiptDao.save(salesReceiptPO);
		
		float totalMoney = 0f;

		for (Long spid : spids) {
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			
			if (salesPayment == null) {
				throw new FLException(150003, "款项不存在");
			}
			
			SalesPO salesPO = salesPayment.getSales();
			
			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}
			
			if(salesPO.getPompany() == 0){
				salesPayment.setCompany(company);
				salesPO.setPompany(company);
			}else{
				salesPayment.setCompany(salesPO.getPompany());
			}
			
			salesPayment.setSalesReceipt(salesReceiptPO);
			salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
			salesPaymentDao.update(salesPayment);

			if (salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {

				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);

				salesDao.update(salesPO);

			} else if (salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {

				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
				salesPO.setFullpayTime(new Timestamp(System.currentTimeMillis()));
				salesDao.update(salesPO);

			}
			
			totalMoney = totalMoney + salesPayment.getReferMoney();
		}

		if (salesPaymentVO.getAdvanceType() != null) {

			Short paymentType = 0;

			if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPECONTRACT_INT) {
				paymentType = 0; // 合同
			} else if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEENGINEERING_INT) {
				paymentType = 1; // 工程
			} else if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEMATERIAL_INT) {
				paymentType = 2; // 主材
			} else if (salesPaymentVO.getAdvanceType() == SalesPaymentPO.COLUMN_ADVANCETYPEZHENGLIN_INT) {
				paymentType = 3; // 正林
			}

			PaymentVO paymentVO = new PaymentVO();

			paymentVO.setOrderId(sales.getOrderId());
			paymentVO.setPaymentType(paymentType);
			paymentVO.setComment(String.format("销售单:%d", sales.getSid()));
			paymentVO.setTransfer(salesPaymentVO.getAdvance());
			paymentVO.setUniqueid("SA" + salesReceiptPO.getSrId());

			paymentService.payPayment(paymentVO, userId);

		}
		
		decorationService.sendMessage(sales.getOrderId(), "主材单", String.format("主材交款金额%s元", totalMoney));

		return 0;
	}

	//销售退款收款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, String userId, Integer company) throws FLException {

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());
		
		if (salesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}
		
		if(salesPayment.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();
		
		UserPO user = userDao.queryUserByUserId(userId);
		salesReceiptPO.setCollecter(user);
		salesReceiptPO.setCollecterName(user.getUserName());
		salesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		
		if (salesReceiptVO.getCash() != null) {
			salesReceiptPO.setCash(salesReceiptVO.getCash());
			salesReceiptPO.setCashInfo(salesReceiptVO.getCashInfo());
		} else {
			salesReceiptPO.setCash(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCashInfo("");
		}

		if (salesReceiptVO.getBank() != null) {
			salesReceiptPO.setBank(salesReceiptVO.getBank());
			salesReceiptPO.setBankInfo(salesReceiptVO.getBankInfo());
		} else {
			salesReceiptPO.setBank(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setBankInfo("");
		}

		if (salesReceiptVO.getCheckv() != null) {
			salesReceiptPO.setCheckv(salesReceiptVO.getCheckv());
			salesReceiptPO.setCheckvBank(salesReceiptVO.getCheckvBank());
		} else {
			salesReceiptPO.setCheckv(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCheckvBank("");
		}

		if (salesReceiptVO.getCoupon() != null) {
			salesReceiptPO.setCoupon(salesReceiptVO.getCoupon());
			salesReceiptPO.setCouponInfo(salesReceiptVO.getCouponInfo());
		} else {
			salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_COUPON_INT);
			salesReceiptPO.setCouponInfo("");
		}

		if (salesReceiptVO.getComment() != null)
			salesReceiptPO.setComment(salesReceiptVO.getComment());
		else {
			salesReceiptPO.setComment("");
		}

		//type作为保留字段 目前没有什么用处 原本的意思为: 0 收款 1 退款
		salesReceiptPO.setType(SalesReceiptPO.COLUMN_SALESRECEIPT_REFUND_TYPE_INT);

		Float referMoneySR = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getCoupon();
		Float referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);
		
		SalesPO sales = salesPayment.getSales();

		salesPayment.setSalesReceipt(salesReceiptPO);
		salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		salesPayment.setCompany(sales.getPompany());
		salesPaymentDao.update(salesPayment);
		
		if(salesPayment.getType() == SalesPaymentPO.COLUMN_DEPOSITREFUNDTYPE_INT){
			sales.setDepositpay(0);
			sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_UNPAY_SHORT);
			salesDao.update(sales);
		}else if(salesPayment.getType() == SalesPaymentPO.COLUMN_MAKEAREFUNDTYPE_INT){
			sales.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			//1 已付款
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			salesDao.update(sales);
		}else if(salesPayment.getType() == SalesPaymentPO.COLUMN_REFUNDSTYPE_INT){
			refundsDao.updateRefundsForStatusBySpid(salesPaymentVO.getSpid(), SalesPaymentPO.COLUMN_SALES_PAIDFORSTATUS_INT);
		}
		
		decorationService.sendMessage(salesPayment.getSales().getOrderId(), "主材单", String.format("主材退款金额%s元", salesPayment.getReferMoney()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmSalesPayment(List<Long> spids, String userId) throws FLException {
		
		List<Long> salesIds = new ArrayList<Long>();

		for (Long spid : spids) {

			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			
			if(salesPayment == null){
				throw new FLException(150003, "款项不存在");
			}
			
			if(salesPayment.getType() == SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT && salesPayment.getSales().getCompany() == 3){
				salesIds.add(salesPayment.getSales().getSid());
			}

			salesPayment.setStatus(SalesPaymentPO.COLUMN_SALES_CONFIRMEDSTATUS_INT);
			salesPaymentDao.update(salesPayment);

			SalesReceiptPO salesReceiptPO = salesReceiptDao.get(salesPayment.getSalesReceipt().getSrId());
			salesReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));
			UserPO user = userDao.queryUserByUserId(userId);
			salesReceiptPO.setConfirmer(user);
			salesReceiptPO.setConfirmerName(user.getUserName());
			salesReceiptDao.update(salesReceiptPO);

			SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());

			if (salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {

				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_CONFIRM_SHORT);

				salesDao.update(salesPO);

			} else if (salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {

				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);

				salesDao.update(salesPO);

			} else if (salesPayment.getType() == SalesPO.STATUS_END_SHORT) {

				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);

				salesDao.update(salesPO);

			}

		}
		
		if(salesIds.size() > 0){
			salesBalanceService.preSalesBalance(salesIds, userId);
		}

		return 0;
	}

	//销售款项撤销
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSalesPayment(SalesPaymentVO salesPaymentVO) throws FLException {

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());

		if (salesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (salesPayment.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT) {
			throw new FLException(150019, "款项不能撤销");
		}

		SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());

		if (salesPayment.getType() == SalesPO.STATUS_ALLBACK_SHORT) {

			salesPO.setDepositpay(0);
			salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);

			salesDao.update(salesPO);
		} else if (salesPayment.getType() == SalesPO.STATUS_DBACKORDER_SHORT) {

			salesPO.setFullpay(0);
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);

			salesDao.update(salesPO);
		} else if (salesPayment.getType() == SalesPO.STATUS_END_SHORT) {

			salesPO.setFullpay(0);
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);

			salesDao.update(salesPO);
		}

		salesPaymentDao.delete(salesPayment);

		return 0;
	}
	
	//撤销定金销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO) throws FLException {

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());
		
		long sid = salesPayment.getSales().getSid();
		
		if(salesPaymentDao.countSalesPaymentBySidAType(sid, SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		SalesPaymentPO depositSalesPaymentPO = salesPaymentDao.querySalesPaymentsBySidAndType(sid, SalesPaymentPO.COLUMN_DEPOSITTYPE_INT);

		if (depositSalesPaymentPO == null) {
			throw new FLException(150037, "定金不存在");
		}
		
		if(depositSalesPaymentPO.getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		SalesPO salesPO = salesDao.get(sid);

		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);

		salesDao.update(salesPO);

		salesPaymentDao.delete(salesPayment);

		return 0;
	}
	
	//撤销补款销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO) throws FLException {

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());
		
		long sid = salesPayment.getSales().getSid();
		
		List<Short> types = Arrays.asList(SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT, SalesPaymentPO.COLUMN_MAKEAREFUNDTYPE_INT);

		List<SalesPaymentPO> fullSalesPaymentPOs = salesPaymentDao.querySalesPaymentsBySidAndTypes(sid, types);

		if (fullSalesPaymentPOs.size() == 0) {
			throw new FLException(150038, "补款不存在");
		}
		
		if(fullSalesPaymentPOs.get(0).getStatus() != SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		SalesPO salesPO = salesDao.get(sid);

		salesPO.setFullpay(0);
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);

		salesDao.update(salesPO);

		salesPaymentDao.delete(salesPayment);

		return 0;
	}
	
	//生成销售款中定金退款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO, String cuid) throws FLException {

		long sid = salesPaymentVO.getSales().getSid();
		
		SalesPO salesPO = salesDao.get(sid);
		
		if(salesPaymentDao.countSalesPaymentBySidAType(sid, SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		SalesPaymentPO depositSalesPaymentPO = salesPaymentDao.querySalesPaymentsBySidAndType(sid, SalesPaymentPO.COLUMN_DEPOSITTYPE_INT);

		if (depositSalesPaymentPO == null) {
			throw new FLException(150037, "定金不存在");
		}
		
		if(depositSalesPaymentPO.getStatus() != SalesPaymentPO.COLUMN_SALES_CONFIRMEDSTATUS_INT){
			throw new FLException(150012, "款项不能进行退款");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(SalesPaymentPO.COLUMN_DEPOSITREFUNDTYPE_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand());
		
		UserPO userPO = userDao.queryUserByUserId(cuid);
		salesPaymentPO.setCreater(userPO);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(depositSalesPaymentPO.getReferMoney());
		salesPaymentPO.setCompany(salesPO.getCompany());

		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setStatus(SalesPO.STATUS_WAST_SHORT);
		salesDao.update(salesPO);

		salesPaymentDao.save(salesPaymentPO);

		salesPaymentVO.setSpid(salesPaymentPO.getSpid());

		return 0;
	}
	
	//生成销售款项中券退款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundSalesPaymentForCoupon(SalesVO salesVO, String cuid) throws FLException {

		long sid = salesVO.getSid();
		
		SalesPO salesPO = salesDao.get(sid);
		
		List<Short> types = Arrays.asList(SalesPaymentPO.COLUMN_DEPOSITTYPE_INT, SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT);

		List<SalesPaymentPO> depositSalesPaymentPOs = salesPaymentDao.querySalesPaymentsBySidAndTypes(sid, types);

		if (depositSalesPaymentPOs.size() == 0) {
			throw new FLException(150003, "款项不存在");
		}
		
		if(depositSalesPaymentPOs.size() == 1){
			SalesPaymentPO depositSalesPaymentPO = depositSalesPaymentPOs.get(0);
			
			if(depositSalesPaymentPO.getStatus() == SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT){
				throw new FLException(150012, "款项不能进行退款");
			}
		}
		
		SalesPaymentPO couponSalesPaymentPO = salesPaymentDao.querySalesPaymentsBySidAndType(sid, SalesPaymentPO.COLUMN_VOUCHERREFUNDTYPE_INT);

		if(couponSalesPaymentPO != null){
			throw new FLException(150032, "销售退券款项已存在");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(SalesPaymentPO.COLUMN_VOUCHERREFUNDTYPE_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand());
		
		UserPO userPO = userDao.queryUserByUserId(cuid);
		salesPaymentPO.setCreater(userPO);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(salesVO.getCoupon());
		salesPaymentPO.setCompany(salesPO.getCompany());

		salesPO.setCoupon(salesVO.getCoupon());
		salesPO.setCouponInfo(salesVO.getCouponInfo());
		salesDao.update(salesPO);

		salesPaymentDao.save(salesPaymentPO);

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateSalesPayment(SalesPaymentVO salesPayment, SalesReceiptVO salesReceipt) throws FLException {
		
		float realMoney = 0;

		SalesPaymentPO salesPaymentPO = salesPaymentDao.get(salesPayment.getSpid());

		if (salesPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		SalesReceiptPO salesReceiptPO = salesPaymentPO.getSalesReceipt();
		
		if(salesPaymentPO.getStatus() != 1){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		float referMoney = salesReceiptPO.getCash() + salesReceiptPO.getBank() + salesReceiptPO.getCheckv() + salesReceiptPO.getCoupon() + salesReceiptPO.getAdvance() + salesReceiptPO.getInstallment() + salesReceiptPO.getAccounts();

		Float cash = salesReceipt.getCash();
		Float bank = salesReceipt.getBank();
		Float checkv = salesReceipt.getCheckv();
		Float coupon = salesReceipt.getCoupon();
		Float advance = salesReceipt.getAdvance();
		
		if (cash != null && cash.floatValue() != 0f) {
			salesReceiptPO.setCash(cash);
			salesReceiptPO.setCashInfo(salesReceipt.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		} else {
			salesReceiptPO.setCash(0f);
			salesReceiptPO.setCashInfo("");
		}
		
		if (bank != null && bank.floatValue() != 0f) {
			salesReceiptPO.setBank(bank);
			salesReceiptPO.setBankInfo(salesReceipt.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		} else {
			salesReceiptPO.setBank(0f);
			salesReceiptPO.setBankInfo("");
		}
		
		if (checkv != null && checkv.floatValue() != 0f) {
			salesReceiptPO.setCheckv(checkv);
			salesReceiptPO.setCheckvBank(salesReceipt.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		} else {
			salesReceiptPO.setCheckv(0f);
			salesReceiptPO.setCheckvBank("");
		}
		
		if (coupon != null && coupon.floatValue() != 0f) {
			realMoney = Arith.add(coupon, realMoney);
		}
		
		if (advance != null && advance.floatValue() != 0f) {
			realMoney = Arith.add(advance, realMoney);
		}
		
		if (referMoney != realMoney) {
			throw new FLException(150025, "款项金额不正确");
		}

		salesReceiptDao.update(salesReceiptPO);
		
	}

	public SalesPaymentVO salesPaymentPOToVO(SalesPaymentPO salesPaymentPO, SalesPaymentVO salesPaymentVO) {
		SalesPO salesPO = salesPaymentPO.getSales();
		SalesVO salesVO = salesPaymentVO.getSales();
		BeanUtil.copyProperties(salesPaymentPO, salesPaymentVO, Arrays.asList("creater", "sales", "salesReceipt"));
		salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
		BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept"));
		BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(salesPO.getCustomer(), salesVO.getCustomer());
		BeanUtil.copyProperties(salesPO.getSalesman(), salesVO.getSalesman(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(salesPO.getDept(), salesVO.getDept(), Arrays.asList("fatherDept", "type", "manager"));
		BeanUtil.copyProperties(salesPO.getRegion(), salesVO.getRegion(), Arrays.asList("fatherDept", "type", "manager"));
		BeanUtil.copyProperties(salesPO.getGuider(), salesVO.getGuider(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(salesPO.getInstorer(), salesVO.getInstorer(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(salesPO.getGuideDept(), salesVO.getGuideDept(), Arrays.asList("fatherDept", "type", "manager"));
		return salesPaymentVO;
	}

}
