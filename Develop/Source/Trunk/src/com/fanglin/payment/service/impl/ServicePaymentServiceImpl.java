package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.impl.DecorationHolonomyServiceImpl;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.dao.ServicePaymentDao;
import com.fanglin.payment.dao.ServiceReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.payment.po.ServiceReceiptPO;
import com.fanglin.payment.service.ServicePaymentService;
import com.fanglin.payment.vo.AdvanceReceiptVO;
import com.fanglin.payment.vo.ServicePaymentVO;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("servicePaymentService")
@Transactional(readOnly = true)
public class ServicePaymentServiceImpl implements ServicePaymentService{

	@Autowired
	private ServicePaymentDao servicePaymentDao;

	@Autowired
	private ServiceReceiptDao serviceReceiptDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private DecorationHolonomyServiceImpl decorationHolonomyService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationOrderDao decorationOrderDao;

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Autowired
	private PaymentDao paymentDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectServicePaymentForRefund(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String cuid) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecorationOrder().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		//编号
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT,"yyyyMMdd");
		Integer pId = Integer.valueOf(FormatUtil.fillZero(count, "00000000"));
		DecorationOrderPO decorationOrder = decorationOrderDao.queryDecorationOrderByOrderId(servicePaymentVO.getDecorationOrder().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(pId,new DecorationOrderPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decorationOrder","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decorationOrder, servicePaymentPO.getDecorationOrder(), Arrays.asList("customerPO","villagePO","designerPO","salesmanPO","supervisorPO","inspectionPO","versionPO","createUserPO"));
		UserPO userPO = userDao.get(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreaterName(userPO.getUserName());
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setCollecter(userPO);
		servicePaymentPO.setCollecterName(userPO.getUserName());
		servicePaymentPO.setCollcetTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_TTYPE_INT);
		
		servicePaymentPO.setServiceMoney(servicePaymentVO.getReferMoney());
		servicePaymentPO.setAdvanceMoney(ServicePaymentPO.COLUMN_MONEY_STR);

		if(decorationHolonomy.getServicePaidup() == null){
			decorationHolonomy.setServicePaidup(0f);
		}
		if(decorationHolonomy.getMaterialPaidup() == null){
			decorationHolonomy.setMaterialPaidup(0f);
		}
		//生成服务款款项
		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		//生成服务款服务费款项收据
		serviceReceiptVO.setRealMoney(servicePaymentVO.getReferMoney());
		collectServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		//更新decorationHolonomy表中的，实收主材额和实收服务费
		decorationHolonomy.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);
		decorationHolonomyDao.update(decorationHolonomy);

		return 0;
	}

	/**
	 * 单交服务费
	 */
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addServiceCharge(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String cuid) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecorationOrder().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		//编号
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT,"yyyyMMdd");
		Integer pId = Integer.valueOf(FormatUtil.fillZero(count, "00000000"));
		DecorationOrderPO decorationOrder = decorationOrderDao.queryDecorationOrderByOrderId(servicePaymentVO.getDecorationOrder().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(pId,new DecorationOrderPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decorationOrder","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decorationOrder, servicePaymentPO.getDecorationOrder(), Arrays.asList("customerPO","villagePO","designerPO","salesmanPO","supervisorPO","inspectionPO","versionPO","createUserPO"));
		UserPO userPO = userDao.get(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreaterName(userPO.getUserName());
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setCollecter(userPO);
		servicePaymentPO.setCollecterName(userPO.getUserName());
		servicePaymentPO.setCollcetTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_STYPE_INT);

		servicePaymentPO.setServiceMoney(servicePaymentVO.getReferMoney());
		servicePaymentPO.setAdvanceMoney(ServicePaymentPO.COLUMN_MONEY_STR);

		if(decorationHolonomy.getServicePaidup() == null){
			decorationHolonomy.setServicePaidup(0f);
		}
		if(decorationHolonomy.getMaterialPaidup() == null){
			decorationHolonomy.setMaterialPaidup(0f);
		}
		//生成服务款款项
		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		//生成服务款服务费款项收据
		serviceReceiptVO.setRealMoney(servicePaymentVO.getReferMoney());
		collectServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		//更新decorationHolonomy表中的，实收主材额和实收服务费
		decorationHolonomy.setServicePaidup(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup()));
		decorationHolonomyDao.update(decorationHolonomy);

		return 0;
	}


	/**
	 * 服务款未确认查询—确认收款
	 */
	@Override
	public void pageServicePaymentForNotInit(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(ServicePaymentPO.COLUMN_STATUS_STR, String.valueOf(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT), "eq") );

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.pageServicePaymentForCollect(paging, filters);
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		ServicePaymentVO servicePaymentVO;

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){

			servicePaymentVO = new ServicePaymentVO(new UserVO(),new UserVO(),new UserVO(),new DecorationOrderVO());
			BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("creater","collecter","confirmer","decorationOrder"));
			servicePaymentVO.getCreater().setBaseInfo(servicePaymentPO.getCreater());
			servicePaymentVO.getCollecter().setBaseInfo(servicePaymentPO.getCollecter());
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder(), servicePaymentVO.getDecorationOrder(), Arrays.asList("customer","village"));
			CustomerVO customer = new CustomerVO();
			servicePaymentVO.getDecorationOrder().setCustomer(customer);
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder().getCustomerPO(), servicePaymentVO.getDecorationOrder().getCustomer());
			VillageVO village = new VillageVO();
			servicePaymentVO.getDecorationOrder().setVillage(village);
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder().getVillagePO(), servicePaymentVO.getDecorationOrder().getVillage(), Arrays.asList("cityProper","buildingNameRule"));

			decorationHolonomyService.copyDecorationHolonomyPOToVO(servicePaymentPO.getDecorationOrder(), servicePaymentVO.getDecorationOrder());

			servicePaymentVOs.add(servicePaymentVO);

		}

		paging.setData(servicePaymentVOs);

	}

	/**
	 * 服务款已确认查询—历史收款
	 */
	@Override
	public void pageServicePaymentForConfirm(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(ServicePaymentPO.COLUMN_STATUS_STR, String.valueOf(ServicePaymentPO.COLUMN_CONFIRMEDSTATUS_INT), "eq") );

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.pageServicePaymentForCollect(paging, filters);
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		ServicePaymentVO servicePaymentVO;

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){

			servicePaymentVO = new ServicePaymentVO(new UserVO(),new UserVO(),new UserVO(),new DecorationOrderVO());
			BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("creater","collecter","confirmer","decorationOrder"));
			servicePaymentVO.getCreater().setBaseInfo(servicePaymentPO.getCreater());
			servicePaymentVO.getCollecter().setBaseInfo(servicePaymentPO.getCollecter());
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder(), servicePaymentVO.getDecorationOrder(), Arrays.asList("customer","village"));
			CustomerVO customer = new CustomerVO();
			servicePaymentVO.getDecorationOrder().setCustomer(customer);
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder().getCustomerPO(), servicePaymentVO.getDecorationOrder().getCustomer());
			VillageVO village = new VillageVO();
			servicePaymentVO.getDecorationOrder().setVillage(village);
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder().getVillagePO(), servicePaymentVO.getDecorationOrder().getVillage(), Arrays.asList("cityProper","buildingNameRule"));

			decorationHolonomyService.copyDecorationHolonomyPOToVO(servicePaymentPO.getDecorationOrder(), servicePaymentVO.getDecorationOrder());

			servicePaymentVOs.add(servicePaymentVO);

		}

		paging.setData(servicePaymentVOs);

	}

	/**
	 * 服务款已收款-确认
	 */
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmServicePayment(List<Long> spids,String userId)  throws FLException{

		for (Long spid : spids) {

			ServicePaymentPO servicePayment = servicePaymentDao.get(spid);

			UserPO user = userDao.get(userId);

			servicePayment.setStatus(ServicePaymentPO.COLUMN_CONFIRMEDSTATUS_INT);
			servicePayment.setConfirmer(user);
			servicePayment.setConfirmerName(user.getUserName());
			servicePayment.setConfirmTime(new Timestamp(System.currentTimeMillis()));
			servicePaymentDao.update(servicePayment);

			ServiceReceiptPO serviceReceiptPO = serviceReceiptDao.queryServiceReceiptBySrId(servicePayment.getServiceReceipt().getSrId());

			serviceReceiptPO.setConfirmer(user);
			serviceReceiptPO.setConfirmerName(user.getUserName());
			serviceReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));
			serviceReceiptDao.update(serviceReceiptPO);

		}

		return 0;
	}

	/**
	 * 服务款查询—历史收款
	 */
	@Override
	public void pageServicePaymentForCollect(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(ServicePaymentPO.COLUMN_STATUS_STR, String.valueOf(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT), "eq") );

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.pageServicePaymentForCollect(paging, filters);
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		ServicePaymentVO servicePaymentVO;

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){

			servicePaymentVO = new ServicePaymentVO(new UserVO(),new UserVO(),new UserVO(),new DecorationOrderVO());
			BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("creater","collecter","confirmer","decorationOrder"));
			servicePaymentVO.getCreater().setBaseInfo(servicePaymentPO.getCreater());
			servicePaymentVO.getCollecter().setBaseInfo(servicePaymentPO.getCollecter());
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder(), servicePaymentVO.getDecorationOrder(), Arrays.asList("customer","village"));
			CustomerVO customer = new CustomerVO();
			servicePaymentVO.getDecorationOrder().setCustomer(customer);
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder().getCustomerPO(), servicePaymentVO.getDecorationOrder().getCustomer());
			VillageVO village = new VillageVO();
			servicePaymentVO.getDecorationOrder().setVillage(village);
			BeanUtil.copyProperties(servicePaymentPO.getDecorationOrder().getVillagePO(), servicePaymentVO.getDecorationOrder().getVillage(), Arrays.asList("cityProper","buildingNameRule"));

			decorationHolonomyService.copyDecorationHolonomyPOToVO(servicePaymentPO.getDecorationOrder(), servicePaymentVO.getDecorationOrder());

			servicePaymentVOs.add(servicePaymentVO);

		}

		paging.setData(servicePaymentVOs);

	}

	/**
	 * 生成服务款信息与收据（servicePayment、serviceReceipt）、并生成或更新：payment、advancePayment、advancereceipt、decorationholonomy
	 */
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,AdvanceReceiptVO advanceReceiptVO,String cuid) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecorationOrder().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		//编号
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT,"yyyyMMdd");
		Integer pId = Integer.valueOf(FormatUtil.fillZero(count, "00000000"));
		DecorationOrderPO decorationOrder = decorationOrderDao.queryDecorationOrderByOrderId(servicePaymentVO.getDecorationOrder().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(pId,new DecorationOrderPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decorationOrder","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decorationOrder, servicePaymentPO.getDecorationOrder(), Arrays.asList("customerPO","villagePO","designerPO","salesmanPO","supervisorPO","inspectionPO","versionPO","createUserPO"));
		UserPO userPO = userDao.get(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreaterName(userPO.getUserName());
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setCollecter(userPO);
		servicePaymentPO.setCollecterName(userPO.getUserName());
		servicePaymentPO.setCollcetTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_STYPE_INT);

		//拆分服务费
		Float money = servicePaymentVO.getReferMoney();
		servicePaymentPO.setAdvanceMoney((float)(int)Arith.div(money, ServicePaymentPO.COLUMN_RATIO_STR));
		servicePaymentPO.setServiceMoney(Arith.sub(money, servicePaymentPO.getAdvanceMoney()));

		if(decorationHolonomy.getServicePaidup() == null){
			decorationHolonomy.setServicePaidup(0f);
		}
		if(decorationHolonomy.getMaterialPaidup() == null){
			decorationHolonomy.setMaterialPaidup(0f);
		}
		//如果现有服务费加上原交服务费 > 总服务费， 将差额给预付款
		if(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup())>decorationHolonomy.getServicePrice()){
			Float sumMoney = Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup());
			Float subMoney = Arith.sub(sumMoney, decorationHolonomy.getServicePrice());
			servicePaymentPO.setAdvanceMoney(Arith.add(servicePaymentPO.getAdvanceMoney(), subMoney));
			servicePaymentPO.setServiceMoney(Arith.sub(money, servicePaymentPO.getAdvanceMoney()));
		}
		//生成服务款款项
		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		//生成服务款款项收据
		serviceReceiptVO.setRealMoney(money);
		collectServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		//更新decorationHolonomy表中的，实收主材额和实收服务费
		decorationHolonomy.setMaterialPaidup(Arith.add(servicePaymentPO.getAdvanceMoney(), decorationHolonomy.getMaterialPaidup()));
		decorationHolonomy.setServicePaidup(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup()));
		decorationHolonomyDao.update(decorationHolonomy);

		//查询该客户是否有记录，如有进行更新，否则添加
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(decorationOrder.getCustomerPO().getCustomerId());
		AdvancePaymentPO advancePayment = new AdvancePaymentPO(new CustomerPO());
		if(advancePaymentPO != null){
			//如果有记录，需要将materialBalance– 原有主材预付款金额 + 新的主材预付款金额 ; 然后更新
			advancePaymentPO.setMaterialBalance(Arith.add(advancePaymentPO.getMaterialBalance(), servicePaymentPO.getAdvanceMoney()));
			advancePaymentDao.update(advancePaymentPO);
		}else{
			//生成advancePayment表中的materialBalance– 主材预付款金额
			BeanUtil.copyProperties(decorationOrder.getCustomerPO(), advancePayment.getCustomer());
			advancePayment.setBalance(0f);
			advancePayment.setProjectBalance(0f);
			advancePayment.setMaterialBalance(servicePaymentPO.getAdvanceMoney());
			advancePayment.setZhenglinBalance(0f);
			advancePaymentDao.save(advancePayment);
		}

		//生成payment预付款记录
		PaymentPO payment = new PaymentPO(new CustomerPO(), new AdvanceReceiptPO());
		BeanUtil.copyProperties(decorationOrder.getCustomerPO(), payment.getCustomer());
		payment.setBalance(advancePayment.getMaterialBalance());
		payment.setRecharge(servicePaymentPO.getAdvanceMoney());
		payment.setType(PaymentPO.PAYMENT_TYPE_COLLECTION_STR);
		payment.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR);
		payment.setDes(servicePaymentPO.getDes());
		payment.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		payment.setOrderId(servicePaymentPO.getDecorationOrder().getOrderId());
		//生成payment预付款款项收据
		advanceReceiptVO.setRealMoney(servicePaymentPO.getAdvanceMoney());
		AdvanceReceiptPO advanceReceiptPO = addAdvanceReceipt(advanceReceiptVO,cuid);

		BeanUtil.copyProperties(advanceReceiptPO, payment.getAdvanceReceipt());
		paymentDao.save(payment);


		return 0;
	}

	/**
	 * 生成AdvanceReceipt收据
	 */
	@Override
	@Transactional(rollbackFor=Exception.class)
	public AdvanceReceiptPO addAdvanceReceipt(AdvanceReceiptVO advanceReceiptVO,String userId) throws FLException {

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		UserPO user = userDao.get(userId);
		advanceReceiptPO.setCollectUser(user);
		advanceReceiptPO.setCollectUserName(user.getUserName());
		advanceReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		advanceReceiptPO.setConfirmUserName("");
		advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_COLLRCT_INT);
		advanceReceiptPO.setReceiptType(AdvanceReceiptPO.STATUS_RECEIPTTYPE_INT);

		if(advanceReceiptVO.getCash() != null){
			advanceReceiptPO.setCash(advanceReceiptVO.getCash());
			advanceReceiptPO.setCashInfo(advanceReceiptVO.getCashInfo());
		}else{
			advanceReceiptPO.setCash(AdvanceReceiptPO.COLUMN_MONEY_STR);
			advanceReceiptPO.setCashInfo("");
		}

		if(advanceReceiptVO.getBank() != null){
			advanceReceiptPO.setBank(advanceReceiptVO.getBank());
			advanceReceiptPO.setBankInfo(advanceReceiptVO.getBankInfo());
		}else{
			advanceReceiptPO.setBank(AdvanceReceiptPO.COLUMN_MONEY_STR);
			advanceReceiptPO.setBankInfo("");
		}

		if(advanceReceiptVO.getCheckv() != null){
			advanceReceiptPO.setCheckv(advanceReceiptVO.getCheckv());
			advanceReceiptPO.setCheckvBankName(advanceReceiptVO.getCheckvBankName());
		}else{
			advanceReceiptPO.setCheckv(AdvanceReceiptPO.COLUMN_MONEY_STR);
			advanceReceiptPO.setCheckvBankName("");
		}

		if(advanceReceiptVO.getInstallment() != null){
			advanceReceiptPO.setInstallment(advanceReceiptVO.getInstallment());
			advanceReceiptPO.setInstallmentBankName(advanceReceiptVO.getInstallmentBankName());
		}else{
			advanceReceiptPO.setInstallment(AdvanceReceiptPO.COLUMN_MONEY_STR);
			advanceReceiptPO.setInstallmentBankName("");
		}

		if(advanceReceiptVO.getAccounts() != null){
			advanceReceiptPO.setAccounts(advanceReceiptVO.getAccounts());
			advanceReceiptPO.setAccountsBankName(advanceReceiptVO.getAccountsBankName());
		}else{
			advanceReceiptPO.setAccounts(AdvanceReceiptPO.COLUMN_MONEY_STR);
			advanceReceiptPO.setAccountsBankName("");
		}

		if(advanceReceiptVO.getDes() != null){
			advanceReceiptPO.setDes(advanceReceiptVO.getDes());
		}else{
			advanceReceiptPO.setDes("");
		}

		advanceReceiptDao.save(advanceReceiptPO);

		return advanceReceiptPO;
	}

	/**
	 * 生成servicePayment服务款收据
	 */
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String userId) throws FLException {

		ServicePaymentPO servicePayment = servicePaymentDao.get(servicePaymentVO.getSpid());

		ServiceReceiptPO serviceReceiptPO = new ServiceReceiptPO();
		UserPO user = userDao.get(userId);
		serviceReceiptPO.setCollecter(user);
		serviceReceiptPO.setCollecterName(user.getUserName());
		serviceReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		serviceReceiptPO.setRealMoney(serviceReceiptVO.getRealMoney());

		if(serviceReceiptVO.getCash() != null){
			serviceReceiptPO.setCash(serviceReceiptVO.getCash());
			serviceReceiptPO.setCashInfo(serviceReceiptVO.getCashInfo());
		}else{
			serviceReceiptPO.setCash(AdvanceReceiptPO.COLUMN_MONEY_STR);
			serviceReceiptPO.setCashInfo("");
		}

		if(serviceReceiptVO.getBank() != null){
			serviceReceiptPO.setBank(serviceReceiptVO.getBank());
			serviceReceiptPO.setBankInfo(serviceReceiptVO.getBankInfo());
		}else{
			serviceReceiptPO.setBank(AdvanceReceiptPO.COLUMN_MONEY_STR);
			serviceReceiptPO.setBankInfo("");
		}

		if(serviceReceiptVO.getCheckv() != null){
			serviceReceiptPO.setCheckv(serviceReceiptVO.getCheckv());
			serviceReceiptPO.setCheckvBank(serviceReceiptVO.getCheckvBank());
		}else{
			serviceReceiptPO.setCheckv(AdvanceReceiptPO.COLUMN_MONEY_STR);
			serviceReceiptPO.setCheckvBank("");
		}

		if(serviceReceiptVO.getInstallment() != null){
			serviceReceiptPO.setInstallment(serviceReceiptVO.getInstallment());
			serviceReceiptPO.setInstallBank(serviceReceiptVO.getInstallBank());
		}else{
			serviceReceiptPO.setInstallment(AdvanceReceiptPO.COLUMN_MONEY_STR);
			serviceReceiptPO.setInstallBank("");
		}

		if(serviceReceiptVO.getAccounts() != null){
			serviceReceiptPO.setAccounts(serviceReceiptVO.getAccounts());
			serviceReceiptPO.setAccountsBank(serviceReceiptVO.getAccountsBank());
		}else{
			serviceReceiptPO.setAccounts(AdvanceReceiptPO.COLUMN_MONEY_STR);
			serviceReceiptPO.setAccountsBank("");
		}

		if(serviceReceiptVO.getDes() != null){
			serviceReceiptPO.setDes(serviceReceiptVO.getDes());
		}else{
			serviceReceiptPO.setDes("");
		}

		serviceReceiptDao.save(serviceReceiptPO);

		servicePayment.setServiceReceipt(serviceReceiptPO);

		servicePaymentDao.update(servicePayment);

		return 0;
	}

}
