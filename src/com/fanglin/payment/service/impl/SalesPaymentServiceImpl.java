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
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.PointofsalesDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.PointofsalesPO;
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
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

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
	
	@Autowired
	private PointofsalesDao pointofsalesDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private DecorationAdditionService decorationAdditionService;
	
	@Autowired
	private SalesActivityService salesActivityService;
	
	@Override
	public void pageSalesPaymentForInit(Paging paging, List<Filter> filters, int company, String companyType) {
		
		if(filters.size() == 0) return;
		
		filters.add(new Filter(SalesPaymentPO.COLUMN_STATUS_STR, String.valueOf(SalesPaymentPO.STATUS_INITIAL_INT), "eq"));

		if(companyType != null){
			filters.add(new Filter(String.format("sales.%s", companyType), String.valueOf(company), "eq"));
		}

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);
		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public void pageSalesPaymentForNotInit(Paging paging, List<Filter> filters, int company, String companyType) {

		if (filters.size() == 0)
			return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_STATUS_STR, String.valueOf(SalesPaymentPO.STATUS_INITIAL_INT), "ne"));

		if(companyType != null){
			filters.add(new Filter(String.format("sales.%s", companyType), String.valueOf(company), "eq"));
		}

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForNotInit(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public void pageSalesPaymentForCollect(Paging paging, List<Filter> filters, int company) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_STATUS_STR, String.valueOf(SalesPaymentPO.STATUS_PAIDFOR_INT), "eq"));
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForCollect(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public void pageSalesPaymentForConfirm(Paging paging, List<Filter> filters, int company) {

		if(filters.size() == 0) return;

		filters.add(new Filter(SalesPaymentPO.COLUMN_STATUS_STR, String.valueOf(SalesPaymentPO.STATUS_CONFIRMED_INT), "eq"));
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.pageSalesPaymentForCollect(paging, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);

		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO) {

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(salesPaymentVO.getSales().getSid());
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}

	@Override
	public List<SalesPaymentVO> querySalesPaymentByOrderId(SalesPaymentVO salesPayment, List<Filter> filters, int company, String companyType) {
		
		String orderId = salesPayment.getSales().getOrderId();
		String no = salesPayment.getSales().getNo();
		Short status = salesPayment.getStatus();
		
		if(orderId == "" && no == "") return null;
		
		if(no != null && no != ""){
			filters.add(new Filter("no", no, "eq"));
		}
		
		if(status != null){
			filters.add(new Filter(SalesPaymentPO.COLUMN_STATUS_STR, String.valueOf(status), "eq"));
		}
		

		if(companyType != null && companyType != ""){
			filters.add(new Filter(String.format("sales.%s", companyType), String.valueOf(company), "eq"));
		}
		
		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentByOrderId(orderId, filters);
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		SalesPaymentVO salesPaymentVO;

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

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

			salesPaymentVO = new SalesPaymentVO(new UserBaseVO(), new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new SalesReceiptVO(new UserBaseVO(), new UserBaseVO()));

			salesPaymentVO = salesPaymentPOToVO(salesPaymentPO, salesPaymentVO);

			salesPaymentVOs.add(salesPaymentVO);

		}

		return salesPaymentVOs;
	}

	@Override
	public long amountSalesPayment(SalesPaymentVO salesPayment) {
		
		String orderId = null;
		
		if (salesPayment.getSales().getSid() != null) {
			SalesPO salesPO = salesDao.get(salesPayment.getSales().getSid());
			
			if (salesPO != null) {
				orderId = salesPO.getOrderId();
			}
		} else if (salesPayment.getSales().getOrderId() != null) {
			orderId = salesPayment.getSales().getOrderId();
		}
		
		long amount = salesPaymentDao.amountSalesPayment(orderId);
		
		return amount;
		
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
		
		List<Short> types = Arrays.asList(salesPaymentVO.getType());

		if (salesPaymentDao.countSalesPayment(salesPaymentVO.getSales().getSid(), types) > 0) {
			throw new FLException(150033, "款项类型已存在");
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList("sales", "collecter", "confirmer"));
		salesPaymentPO.setSales(sales);
		salesPaymentPO.setType(salesPaymentVO.getType());
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);
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
		sales.setCtype(salesPaymentVO.getSales().getCtype());
		sales.setCvalue(salesPaymentVO.getSales().getCvalue());

		salesDao.update(sales);

		return 0;
	}
	
	//添加补款销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO, String cuid, int company) throws FLException {

		long sid = salesPaymentVO.getSales().getSid();
		
		SalesPO sales = salesDao.get(sid);

		List<Short> types = Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.TYPE_MAKEAREFUND_INT);

		int fullCounts = salesPaymentDao.countSalesPayment(sid, types);

		if (fullCounts > 0) {
			throw new FLException(150040, "补款已存在");
		}
		
		List<Short> deposiTtypes = Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT);
		
		SalesPaymentPO depositSalesPaymentPO = salesPaymentDao.querySalesPayment(sid, deposiTtypes);
		
		if(depositSalesPaymentPO != null && depositSalesPaymentPO.getStatus() == SalesPaymentPO.STATUS_INITIAL_INT){
			throw new FLException(150041, "定金状态不可操作");
		}
		
		long couponValue = sales.getCoupon();
		long venderMalingValue = sales.getVenderMaling();
		long subSalesMoney = Arith.add(couponValue, venderMalingValue);
		long sumSalesMoney = Arith.add(depositSalesPaymentPO == null ? 0 : depositSalesPaymentPO.getReferMoney(), salesPaymentVO.getReferMoney());
		
		if(sales.getTotal() != Arith.add(subSalesMoney, sumSalesMoney)){
			throw new FLException(150017, "项目总额与款项额不符");
		}
		
		if(sales.getTotal() != salesItemDao.countSalesItemForAmount(sid)){
			throw new FLException(150017, "项目总额与款项额不符");
		}
		
		if (sales.getStatus() != 0) {
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		if(salesPaymentVO.getReferMoney() < 0){
			//验证销售活动积分
			salesActivityService.checkSalesActivity(sid, Math.abs(salesPaymentVO.getReferMoney()));
		}

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		BeanUtil.copyProperties(salesPaymentVO, salesPaymentPO, Arrays.asList("sales", "collecter", "confirmer"));
		salesPaymentPO.setSales(sales);
		
		if(salesPaymentVO.getReferMoney() >= 0){
			salesPaymentPO.setType(SalesPaymentPO.TYPE_REPLENISHMENT_INT);
		}else if(salesPaymentVO.getReferMoney() < 0){
			salesPaymentPO.setType(SalesPaymentPO.TYPE_MAKEAREFUND_INT);
		}
		
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);
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
	public int collectSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, List<Long> posids, String userId, Integer company) throws FLException {

		SalesPaymentPO salesPayment = salesPaymentDao.get(salesPaymentVO.getSpid());
		
		if (salesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}
		
		if (salesPayment.getStatus() != SalesPaymentPO.STATUS_INITIAL_INT) {
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
			salesReceiptPO.setCoupon(salesReceiptVO.getCoupon());
			salesReceiptPO.setCouponInfo(salesReceiptVO.getCouponInfo());
		} else {
			salesReceiptPO.setCoupon(SalesReceiptPO.COLUMN_MONEY_INT);
			salesReceiptPO.setCouponInfo("");
		}

		if (salesReceiptVO.getAdvance() != null && salesReceiptVO.getAdvance() != 0) {
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(sales.getOrderId());
			
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

		Long referMoneySR = Arith.add(Arith.add(Arith.add(Arith.add(salesReceiptPO.getCash(), salesReceiptPO.getBank()), salesReceiptPO.getCheckv()), salesReceiptPO.getCoupon()), salesReceiptPO.getAdvance());
		Long referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);

		salesPayment.setSalesReceipt(salesReceiptPO);
		salesPayment.setStatus(SalesPaymentPO.STATUS_PAIDFOR_INT);
		
		if(sales.getPompany() == 0){
			salesPayment.setCompany(company);
			sales.setPompany(company);
		}else{
			salesPayment.setCompany(sales.getPompany());
		}
		
		salesPaymentDao.update(salesPayment);

		if (salesPayment.getType() == SalesPaymentPO.TYPE_DEPOSIT_INT || salesPayment.getType() == SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT) {
			sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);
			salesDao.update(sales);
		} else if (salesPayment.getType() == SalesPaymentPO.TYPE_REPLENISHMENT_INT) {
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			sales.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			salesDao.update(sales);
		}

		if (salesReceiptVO.getAdvanceType() != null) {

			Short paymentType = 0;

			if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_CONTRACT_INT) {
				paymentType = 0; // 合同
			} else if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_ENGINEERING_INT) {
				paymentType = 1; // 工程
			} else if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_MATERIAL_INT) {
				paymentType = 2; // 主材
			} else if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_ZHENGLIN_INT) {
				paymentType = 3; // 正林
			}

			PaymentVO paymentVO = new PaymentVO();

			paymentVO.setOrderId(sales.getOrderId());
			paymentVO.setPaymentType(paymentType);
			paymentVO.setComment(String.format("销售单:%d", sales.getSid()));
			paymentVO.setTransfer(salesReceiptVO.getAdvance());
			paymentVO.setUniqueid("SA" + salesReceiptPO.getSrId());

			// 预付款付款
			paymentService.payPayment(paymentVO, userId);
		}
		
		//更新pos使用的销售点信息的状态
		if(posids != null && posids.size() > 0){
			pointofsalesDao.updatePointofsales(posids, salesReceiptPO.getSrId(), PointofsalesPO.STATUS_USED_INT, PointofsalesPO.TYPE_SALES_INT);
		}
		
		//更新装修单上的销售比例
		DecorationPO decorationPO = decorationDao.get(sales.getOrderId());
		
		decorationAdditionService.updateDecorationForSaleScale(decorationPO);
		
		decorationService.sendMessage(salesPayment.getSales().getOrderId(), "主材单", String.format("主材交款金额%.3f元", Arith.div(salesPayment.getReferMoney(), 1000.0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectSalesPayments(List<Long> spids, SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, List<Long> posids, String userId, Integer company) throws FLException {

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
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(sales.getOrderId());
			
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

		Long referMoneySR = Arith.add(Arith.add(Arith.add(salesReceiptPO.getCash(), salesReceiptPO.getBank()), salesReceiptPO.getCheckv()), salesReceiptPO.getAdvance());

		Long referMoneyPY = 0L;
		
		for (Long spid : spids) {
			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);

			if (salesPayment.getStatus() != SalesPaymentPO.STATUS_INITIAL_INT) {
				throw new FLException(150036, "款项状态不可操作");
			}

			referMoneyPY = Arith.add(referMoneyPY, salesPayment.getReferMoney());
		}

		if (Arith.sub(referMoneySR, referMoneyPY) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}

		salesReceiptDao.save(salesReceiptPO);
		
		long totalMoney = 0;

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
			salesPayment.setStatus(SalesPaymentPO.STATUS_PAIDFOR_INT);
			salesPaymentDao.update(salesPayment);

			if (salesPayment.getType() == SalesPaymentPO.TYPE_DEPOSIT_INT || salesPayment.getType() == SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT) {

				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_PAYED_SHORT);

				salesDao.update(salesPO);

			} else if (salesPayment.getType() == SalesPaymentPO.TYPE_REPLENISHMENT_INT) {

				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
				salesPO.setFullpayTime(new Timestamp(System.currentTimeMillis()));
				salesDao.update(salesPO);

			}
			
			totalMoney = Arith.add(totalMoney, salesPayment.getReferMoney());
		}

		if (salesReceiptVO.getAdvanceType() != null) {

			Short paymentType = 0;

			if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_CONTRACT_INT) {
				paymentType = 0; // 合同
			} else if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_ENGINEERING_INT) {
				paymentType = 1; // 工程
			} else if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_MATERIAL_INT) {
				paymentType = 2; // 主材
			} else if (salesReceiptVO.getAdvanceType() == SalesPaymentPO.ADVANCETYPE_ZHENGLIN_INT) {
				paymentType = 3; // 正林
			}

			PaymentVO paymentVO = new PaymentVO();

			paymentVO.setOrderId(sales.getOrderId());
			paymentVO.setPaymentType(paymentType);
			paymentVO.setComment(String.format("销售单:%d", sales.getSid()));
			paymentVO.setTransfer(salesReceiptVO.getAdvance());
			paymentVO.setUniqueid("SA" + salesReceiptPO.getSrId());

			paymentService.payPayment(paymentVO, userId);

		}
		
		//更新pos使用的销售点信息的状态
		if(posids != null && posids.size() > 0){
			pointofsalesDao.updatePointofsales(posids, salesReceiptPO.getSrId(), PointofsalesPO.STATUS_USED_INT, PointofsalesPO.TYPE_SALES_INT);
		}
		
		//更新装修单上的销售比例
		DecorationPO decorationPO = decorationDao.get(sales.getOrderId());
		
		decorationAdditionService.updateDecorationForSaleScale(decorationPO);
		
		decorationService.sendMessage(sales.getOrderId(), "主材单", String.format("主材交款金额%.3f元", Arith.div(totalMoney, 1000.0)));

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
		
		if(salesPayment.getStatus() != SalesPaymentPO.STATUS_INITIAL_INT){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		//验证销售活动积分
		salesActivityService.checkSalesActivity(salesPayment.getSales().getSid(), salesPayment.getReferMoney());

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

		Long referMoneySR = Arith.add(Arith.add(Arith.add(salesReceiptPO.getCash(), salesReceiptPO.getBank()), salesReceiptPO.getCheckv()), salesReceiptPO.getCoupon());
		Long referMoneyDB = salesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != SalesReceiptPO.COLUMN_MONEY_INT) {
			throw new FLException(150025, "款项金额不正确");
		}
		salesReceiptDao.save(salesReceiptPO);
		
		SalesPO sales = salesPayment.getSales();

		salesPayment.setSalesReceipt(salesReceiptPO);
		salesPayment.setStatus(SalesPaymentPO.STATUS_PAIDFOR_INT);
		salesPayment.setCompany(sales.getPompany());
		salesPaymentDao.update(salesPayment);
		
		if(salesPayment.getType() == SalesPaymentPO.TYPE_DEPOSITREFUND_INT || salesPayment.getType() == SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT){
			sales.setDepositpay(0);
			sales.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_UNPAY_SHORT);
			salesDao.update(sales);
		}else if(salesPayment.getType() == SalesPaymentPO.TYPE_MAKEAREFUND_INT){
			sales.setFullpayTime(new Timestamp(System.currentTimeMillis()));
			//1 已付款
			sales.setFullpayStatus(SalesPO.FULLPAYSTATUS_PAYED_SHORT);
			salesDao.update(sales);
		}else if(salesPayment.getType() == SalesPaymentPO.TYPE_REFUNDS_INT){
			refundsDao.updateRefundsForStatusBySpid(salesPaymentVO.getSpid(), SalesPaymentPO.STATUS_PAIDFOR_INT);
		}
		
		//更新装修单上的销售比例
		DecorationPO decorationPO = decorationDao.get(sales.getOrderId());
		
		decorationAdditionService.updateDecorationForSaleScale(decorationPO);
		
		decorationService.sendMessage(salesPayment.getSales().getOrderId(), "主材单", String.format("主材退款金额%.3f元", Arith.div(salesPayment.getReferMoney(), 1000.0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmSalesPayment(List<Long> spids, String userId) throws FLException {
		
		List<Long> salesIds = new ArrayList<Long>();
		List<Long> salesIds4NotRefundDeposit = new ArrayList<Long>();

		for (Long spid : spids) {

			SalesPaymentPO salesPayment = salesPaymentDao.get(spid);
			
			if(salesPayment == null){
				throw new FLException(150003, "款项不存在");
			}
			
			//不可退定金(后增加的8)也会生成预结算信息
			if(salesPayment.getType() == SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT){
				salesIds4NotRefundDeposit.add(salesPayment.getSales().getSid());
			}
			
			//补款(3)和补款退款(5)的时候 , 会生成预结算信息
			if(salesPayment.getType() == SalesPaymentPO.TYPE_REPLENISHMENT_INT || salesPayment.getType() == SalesPaymentPO.TYPE_MAKEAREFUND_INT){
				salesIds.add(salesPayment.getSales().getSid());
			}

			salesPayment.setStatus(SalesPaymentPO.STATUS_CONFIRMED_INT);
			salesPaymentDao.update(salesPayment);

			SalesReceiptPO salesReceiptPO = salesPayment.getSalesReceipt();
			salesReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));
			UserPO user = userDao.queryUserByUserId(userId);
			salesReceiptPO.setConfirmer(user);
			salesReceiptPO.setConfirmerName(user.getUserName());
			salesReceiptDao.update(salesReceiptPO);

			SalesPO salesPO = salesPayment.getSales();

			if (salesPayment.getType() == SalesPaymentPO.TYPE_DEPOSIT_INT || salesPayment.getType() == SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT) {

				salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_CONFIRM_SHORT);

				salesDao.update(salesPO);

			} else if (salesPayment.getType() == SalesPaymentPO.TYPE_REPLENISHMENT_INT) {

				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);

				salesDao.update(salesPO);

			} else if (salesPayment.getType() == SalesPaymentPO.TYPE_MAKEAREFUND_INT) {

				salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);

				salesDao.update(salesPO);

			}

		}
		
		if(salesIds4NotRefundDeposit.size() > 0){
			salesBalanceService.advSalesBalance(salesIds4NotRefundDeposit, userId);
		}
		
		if(salesIds.size() > 0){
			salesBalanceService.revSalesBalance(salesIds, userId);
			salesBalanceService.preSalesBalance(salesIds, userId);
		}

		return 0;
	}
	
	//撤销定金销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO) throws FLException {
		
		long sid = salesPaymentVO.getSales().getSid();
		
		if(salesPaymentDao.countSalesPayment(sid, Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT)) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		List<Short> types = Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT);

		SalesPaymentPO depositSalesPaymentPO = salesPaymentDao.querySalesPayment(sid, types);

		if (depositSalesPaymentPO == null) {
			throw new FLException(150037, "定金不存在");
		}
		
		if(depositSalesPaymentPO.getStatus() != SalesPaymentPO.STATUS_INITIAL_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		SalesPO salesPO = salesDao.get(sid);

		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setCtype(SalesPO.CTYPE_PASS_INT);
		salesPO.setCvalue(0);

		salesDao.update(salesPO);

		salesPaymentDao.delete(depositSalesPaymentPO);

		return 0;
	}
	
	//撤销补款销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO) throws FLException {
		
		long sid = salesPaymentVO.getSales().getSid();
		
		List<Short> types = Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.TYPE_MAKEAREFUND_INT);

		SalesPaymentPO salesPayment = salesPaymentDao.querySalesPayment(sid, types);

		if (salesPayment == null) {
			throw new FLException(150038, "补款不存在");
		}
		
		if(salesPayment.getStatus() != SalesPaymentPO.STATUS_INITIAL_INT){
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
		
		if(salesPaymentDao.countSalesPayment(sid, Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT)) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		List<Short> types = Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT);
		
		SalesPaymentPO depositSalesPaymentPO = salesPaymentDao.querySalesPayment(sid, types);

		if (depositSalesPaymentPO == null) {
			throw new FLException(150037, "定金不存在");
		}
		
		if(depositSalesPaymentPO.getStatus() != SalesPaymentPO.STATUS_CONFIRMED_INT){
			throw new FLException(150012, "款项不能进行退款");
		}
		
		//验证销售活动积分
		salesActivityService.checkSalesActivity(sid, depositSalesPaymentPO.getReferMoney());

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(SalesPaymentPO.TYPE_DEPOSITREFUND_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);
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
		
		List<Short> types = Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.TYPE_MAKEAREFUND_INT);

		int counts = salesPaymentDao.countSalesPayment(sid, types);

		if (counts == 0) {
			throw new FLException(150003, "款项不存在");
		}
		
		List<Short> type = Arrays.asList(SalesPaymentPO.TYPE_VOUCHERREFUND_INT);
		
		SalesPaymentPO couponSalesPaymentPO = salesPaymentDao.querySalesPayment(sid, type);

		if(couponSalesPaymentPO != null){
			throw new FLException(150032, "销售退券款项已存在");
		}
		
		//验证销售活动积分
		salesActivityService.checkSalesActivity(sid, salesVO.getCoupon());

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(SalesPaymentPO.TYPE_VOUCHERREFUND_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);
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
		
		long realMoney = 0;

		SalesPaymentPO salesPaymentPO = salesPaymentDao.get(salesPayment.getSpid());

		if (salesPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		SalesReceiptPO salesReceiptPO = salesPaymentPO.getSalesReceipt();
		
		if(salesPaymentPO.getStatus() != 1){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		long referMoney = Arith.add(Arith.add(Arith.add(Arith.add(Arith.add(Arith.add(salesReceiptPO.getCash(), salesReceiptPO.getBank()), salesReceiptPO.getCheckv()), salesReceiptPO.getCoupon()), salesReceiptPO.getAdvance()), salesReceiptPO.getInstallment()), salesReceiptPO.getAccounts());
		
		Long cash = salesReceipt.getCash();
		Long bank = salesReceipt.getBank();
		Long checkv = salesReceipt.getCheckv();
		Long coupon = salesReceipt.getCoupon();
		Long advance = salesReceipt.getAdvance();
		
		if (cash != null && cash != 0) {
			salesReceiptPO.setCash(cash);
			salesReceiptPO.setCashInfo(salesReceipt.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		} else {
			salesReceiptPO.setCash(0);
			salesReceiptPO.setCashInfo("");
		}
		
		if (bank != null && bank != 0) {
			salesReceiptPO.setBank(bank);
			salesReceiptPO.setBankInfo(salesReceipt.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		} else {
			salesReceiptPO.setBank(0);
			salesReceiptPO.setBankInfo("");
		}
		
		if (checkv != null && checkv != 0) {
			salesReceiptPO.setCheckv(checkv);
			salesReceiptPO.setCheckvBank(salesReceipt.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		} else {
			salesReceiptPO.setCheckv(0);
			salesReceiptPO.setCheckvBank("");
		}
		
		if (coupon != null && coupon != 0) {
			realMoney = Arith.add(coupon, realMoney);
		}
		
		if (advance != null && advance != 0) {
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
		
		if(salesPaymentPO.getSalesReceipt() != null){
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(salesPaymentPO.getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));
		}
		
		salesPaymentVO.getCreater().setBaseInfo(salesPaymentPO.getCreater());
		BeanUtil.copyProperties(salesPO, salesVO, Arrays.asList("house", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept", "supplier", "finisher"));
		BeanUtil.copyProperties(salesPO.getHouse(), salesVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(salesPO.getHouse().getVillage(), salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(salesPO.getHouse().getVillage().getCityProper(), salesVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(salesPO.getHouse().getVillage().getCityProper().getCity(), salesVO.getHouse().getVillage().getCityProper().getCity(), Arrays.asList("region"));
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
