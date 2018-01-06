package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
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
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("servicePaymentService")
@Transactional(readOnly = true)
public class ServicePaymentServiceImpl implements ServicePaymentService{

	@Autowired
	private ServicePaymentDao servicePaymentDao;

	@Autowired
	private ServiceReceiptDao serviceReceiptDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Autowired
	private PaymentDao paymentDao;
	
	@Override
	public void pageServicePaymentForCollect(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(ServicePaymentPO.COLUMN_STATUS_STR, String.valueOf(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT), "eq") );

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.pageServicePaymentForCollect(paging, filters);
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		ServicePaymentVO servicePaymentVO;

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){

			servicePaymentVO = new ServicePaymentVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO(),new DecorationVO(),new ServiceReceiptVO());
			BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("creater","collecter","confirmer","decoration","serviceReceipt"));
			servicePaymentVO.getCreater().setBaseInfo(servicePaymentPO.getCreater());
			servicePaymentVO.getCollecter().setBaseInfo(servicePaymentPO.getCollecter());
			BeanUtil.copyProperties(servicePaymentPO.getDecoration(), servicePaymentVO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
			servicePaymentPO.getDecoration().ptvcascade(servicePaymentVO.getDecoration());
			BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt(), servicePaymentVO.getServiceReceipt(), Arrays.asList("collecter","confirmer"));

			servicePaymentVOs.add(servicePaymentVO);

		}

		paging.setData(servicePaymentVOs);

	}
	
	@Override
	public void pageServicePaymentForConfirm(Paging paging, List<Filter> filters) {

		if(filters.size() == 0) return;

		filters.add(new Filter(ServicePaymentPO.COLUMN_STATUS_STR, String.valueOf(ServicePaymentPO.COLUMN_CONFIRMEDSTATUS_INT), "eq") );

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.pageServicePaymentForCollect(paging, filters);
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		ServicePaymentVO servicePaymentVO;

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){

			servicePaymentVO = new ServicePaymentVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO(),new DecorationVO(),new ServiceReceiptVO());
			BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("creater","collecter","confirmer","decoration","serviceReceipt"));
			servicePaymentVO.getCreater().setBaseInfo(servicePaymentPO.getCreater());
			servicePaymentVO.getCollecter().setBaseInfo(servicePaymentPO.getCollecter());
			BeanUtil.copyProperties(servicePaymentPO.getDecoration(), servicePaymentVO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
			servicePaymentPO.getDecoration().ptvcascade(servicePaymentVO.getDecoration());
			BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt(), servicePaymentVO.getServiceReceipt(), Arrays.asList("collecter","confirmer"));
			
			servicePaymentVOs.add(servicePaymentVO);

		}

		paging.setData(servicePaymentVOs);

	}
	
	@Override
	public List<ServicePaymentVO> queryServicePaymentForNotInitBySrId(ServiceReceiptVO serviceReceiptVO) {
		
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();
		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.queryServicePaymentForNotInitBySrId(serviceReceiptVO.getSrId());

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){
			ServicePaymentVO _servicePaymentVO = new ServicePaymentVO();
			BeanUtil.copyProperties(servicePaymentPO, _servicePaymentVO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
			
			servicePaymentVOs.add(_servicePaymentVO);
		}

		return servicePaymentVOs;
	}
	
	@Override
	public List<ServicePaymentVO> queryServicePaymentByOrderId(ServicePaymentVO servicePaymentVO) {
		
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();
		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.queryServicePaymentByOrderId(servicePaymentVO.getDecoration().getOrderId());

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){
			ServicePaymentVO _servicePaymentVO = new ServicePaymentVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO(),new DecorationVO(),new ServiceReceiptVO());
			BeanUtil.copyProperties(servicePaymentPO, _servicePaymentVO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
			BeanUtil.copyProperties(servicePaymentPO.getDecoration(), _servicePaymentVO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
			servicePaymentPO.getDecoration().ptvcascade(servicePaymentVO.getDecoration());
			BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt(), _servicePaymentVO.getServiceReceipt(), Arrays.asList("collecter","confirmer"));
			
			servicePaymentVOs.add(_servicePaymentVO);
		}

		return servicePaymentVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,AdvanceReceiptVO advanceReceiptVO,String cuid) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecoration().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		DecorationPO decoration = decorationDao.queryDecorationByOrderId(servicePaymentVO.getDecoration().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(new DecorationPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decoration, servicePaymentPO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
		UserPO userPO = userDao.queryUserByUserId(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreaterName(userPO.getUserName());
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setCollecter(userPO);
		servicePaymentPO.setCollecterName(userPO.getUserName());
		servicePaymentPO.setCollcetTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_STYPE_INT);

		Float money = servicePaymentVO.getReferMoney();
		servicePaymentPO.setAdvanceMoney((float)(int)Arith.div(money, ServicePaymentPO.COLUMN_RATIO_INT));
		servicePaymentPO.setServiceMoney(Arith.sub(money, servicePaymentPO.getAdvanceMoney()));

		if(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup())>decorationHolonomy.getServicePrice()){
			Float sumMoney = Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup());
			Float subMoney = Arith.sub(sumMoney, decorationHolonomy.getServicePrice());
			servicePaymentPO.setAdvanceMoney(Arith.add(servicePaymentPO.getAdvanceMoney(), subMoney));
			servicePaymentPO.setServiceMoney(Arith.sub(money, servicePaymentPO.getAdvanceMoney()));
		}
		
		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		serviceReceiptVO.setRealMoney(money);
		generateServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		decorationHolonomy.setMaterialPaidup(Arith.add(servicePaymentPO.getAdvanceMoney(), decorationHolonomy.getMaterialPaidup()));
		decorationHolonomy.setServicePaidup(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup()));
		decorationHolonomyDao.update(decorationHolonomy);

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(decoration.getCustomer().getCid(),decoration.getCompany());
		if(advancePaymentPO != null){
			advancePaymentPO.setMaterialBalance(Arith.add(advancePaymentPO.getMaterialBalance(), servicePaymentPO.getAdvanceMoney()));
			advancePaymentDao.update(advancePaymentPO);
		}else{
			advancePaymentPO = new AdvancePaymentPO(new CustomerPO());
			BeanUtil.copyProperties(decoration.getCustomer(), advancePaymentPO.getCustomer());
			advancePaymentPO.setBalance(0f);
			advancePaymentPO.setProjectBalance(0f);
			advancePaymentPO.setMaterialBalance(servicePaymentPO.getAdvanceMoney());
			advancePaymentPO.setZhenglinBalance(0f);
			advancePaymentPO.setCompany(decoration.getCompany());
			advancePaymentDao.save(advancePaymentPO);
		}

		PaymentPO payment = new PaymentPO(new CustomerPO(), new AdvanceReceiptPO());
		BeanUtil.copyProperties(decoration.getCustomer(), payment.getCustomer());
		payment.setBalance(advancePaymentPO.getMaterialBalance());
		payment.setRecharge(servicePaymentPO.getAdvanceMoney());
		payment.setType(PaymentPO.PAYMENT_TYPE_COLLECTION_STR);
		payment.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR);
		payment.setComment(servicePaymentPO.getComment());
		payment.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		payment.setOrderId(servicePaymentPO.getDecoration().getOrderId());
		payment.setCompany(decoration.getCompany());
		
		advanceReceiptVO.setRealMoney(servicePaymentPO.getAdvanceMoney());
		AdvanceReceiptPO advanceReceiptPO = addAdvanceReceipt(advanceReceiptVO,cuid);

		BeanUtil.copyProperties(advanceReceiptPO, payment.getAdvanceReceipt());
		paymentDao.save(payment);

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectServicePaymentForService(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String cuid) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecoration().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		DecorationPO decoration = decorationDao.queryDecorationByOrderId(servicePaymentVO.getDecoration().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(new DecorationPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decoration, servicePaymentPO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
		UserPO userPO = userDao.queryUserByUserId(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreaterName(userPO.getUserName());
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setCollecter(userPO);
		servicePaymentPO.setCollecterName(userPO.getUserName());
		servicePaymentPO.setCollcetTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_STYPE_INT);

		servicePaymentPO.setServiceMoney(servicePaymentVO.getReferMoney());
		servicePaymentPO.setAdvanceMoney(ServicePaymentPO.COLUMN_MONEY_INT);

		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		serviceReceiptVO.setRealMoney(servicePaymentVO.getReferMoney());
		generateServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		decorationHolonomy.setServicePaidup(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup()));
		decorationHolonomyDao.update(decorationHolonomy);

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundServicePaymentForService(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String cuid) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecoration().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		DecorationPO decoration = decorationDao.queryDecorationByOrderId(servicePaymentVO.getDecoration().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(new DecorationPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decoration, servicePaymentPO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
		UserPO userPO = userDao.queryUserByUserId(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreaterName(userPO.getUserName());
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setCollecter(userPO);
		servicePaymentPO.setCollecterName(userPO.getUserName());
		servicePaymentPO.setCollcetTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_TTYPE_INT);
		
		servicePaymentPO.setServiceMoney(servicePaymentVO.getReferMoney());
		servicePaymentPO.setAdvanceMoney(ServicePaymentPO.COLUMN_MONEY_INT);

		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		serviceReceiptVO.setRealMoney(servicePaymentVO.getReferMoney());
		generateServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		decorationHolonomy.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);
		decorationHolonomyDao.update(decorationHolonomy);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmServicePayment(List<Long> spids,String userId)  throws FLException{

		for (Long spid : spids) {

			ServicePaymentPO servicePayment = servicePaymentDao.get(spid);

			UserPO user = userDao.queryUserByUserId(userId);

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

	@Transactional(rollbackFor=Exception.class)
	private AdvanceReceiptPO addAdvanceReceipt(AdvanceReceiptVO advanceReceiptVO,String userId){

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_COLLRCT_INT);
		advanceReceiptPO.setType(AdvanceReceiptPO.STATUS_RECEIPTTYPE_INT);

		if(advanceReceiptVO.getCash() != null){
			advanceReceiptPO.setCash(advanceReceiptVO.getCash());
			advanceReceiptPO.setCashInfo(advanceReceiptVO.getCashInfo());
		}else{
			advanceReceiptPO.setCash(AdvanceReceiptPO.COLUMN_MONEY_INT);
			advanceReceiptPO.setCashInfo("");
		}

		if(advanceReceiptVO.getBank() != null){
			advanceReceiptPO.setBank(advanceReceiptVO.getBank());
			advanceReceiptPO.setBankInfo(advanceReceiptVO.getBankInfo());
		}else{
			advanceReceiptPO.setBank(AdvanceReceiptPO.COLUMN_MONEY_INT);
			advanceReceiptPO.setBankInfo("");
		}

		if(advanceReceiptVO.getCheckv() != null){
			advanceReceiptPO.setCheckv(advanceReceiptVO.getCheckv());
			advanceReceiptPO.setCheckvBank(advanceReceiptVO.getCheckvBank());
		}else{
			advanceReceiptPO.setCheckv(AdvanceReceiptPO.COLUMN_MONEY_INT);
			advanceReceiptPO.setCheckvBank("");
		}

		if(advanceReceiptVO.getInstallment() != null){
			advanceReceiptPO.setInstallment(advanceReceiptVO.getInstallment());
			advanceReceiptPO.setInstallmentBank(advanceReceiptVO.getInstallmentBank());
		}else{
			advanceReceiptPO.setInstallment(AdvanceReceiptPO.COLUMN_MONEY_INT);
			advanceReceiptPO.setInstallmentBank("");
		}

		if(advanceReceiptVO.getAccounts() != null){
			advanceReceiptPO.setAccounts(advanceReceiptVO.getAccounts());
			advanceReceiptPO.setAccountsBank(advanceReceiptVO.getAccountsBank());
		}else{
			advanceReceiptPO.setAccounts(AdvanceReceiptPO.COLUMN_MONEY_INT);
			advanceReceiptPO.setAccountsBank("");
		}

		if(advanceReceiptVO.getComment() != null){
			advanceReceiptPO.setComment(advanceReceiptVO.getComment());
		}else{
			advanceReceiptPO.setComment("");
		}

		advanceReceiptDao.save(advanceReceiptPO);

		return advanceReceiptPO;
	}

	@Transactional(rollbackFor=Exception.class)
	private int generateServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String userId){

		ServicePaymentPO servicePayment = servicePaymentDao.get(servicePaymentVO.getSpid());

		ServiceReceiptPO serviceReceiptPO = new ServiceReceiptPO();
		UserPO user = userDao.queryUserByUserId(userId);
		serviceReceiptPO.setCollecter(user);
		serviceReceiptPO.setCollecterName(user.getUserName());
		serviceReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		serviceReceiptPO.setRealMoney(serviceReceiptVO.getRealMoney());

		if(serviceReceiptVO.getCash() != null){
			serviceReceiptPO.setCash(serviceReceiptVO.getCash());
			serviceReceiptPO.setCashInfo(serviceReceiptVO.getCashInfo());
		}else{
			serviceReceiptPO.setCash(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setCashInfo("");
		}

		if(serviceReceiptVO.getBank() != null){
			serviceReceiptPO.setBank(serviceReceiptVO.getBank());
			serviceReceiptPO.setBankInfo(serviceReceiptVO.getBankInfo());
		}else{
			serviceReceiptPO.setBank(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setBankInfo("");
		}

		if(serviceReceiptVO.getCheckv() != null){
			serviceReceiptPO.setCheckv(serviceReceiptVO.getCheckv());
			serviceReceiptPO.setCheckvBank(serviceReceiptVO.getCheckvBank());
		}else{
			serviceReceiptPO.setCheckv(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setCheckvBank("");
		}

		if(serviceReceiptVO.getInstallment() != null){
			serviceReceiptPO.setInstallment(serviceReceiptVO.getInstallment());
			serviceReceiptPO.setInstallBank(serviceReceiptVO.getInstallBank());
		}else{
			serviceReceiptPO.setInstallment(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setInstallBank("");
		}

		if(serviceReceiptVO.getAccounts() != null){
			serviceReceiptPO.setAccounts(serviceReceiptVO.getAccounts());
			serviceReceiptPO.setAccountsBank(serviceReceiptVO.getAccountsBank());
		}else{
			serviceReceiptPO.setAccounts(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setAccountsBank("");
		}

		if(serviceReceiptVO.getComment() != null){
			serviceReceiptPO.setComment(serviceReceiptVO.getComment());
		}else{
			serviceReceiptPO.setComment("");
		}
		
		serviceReceiptPO.setType(servicePayment.getType());

		serviceReceiptDao.save(serviceReceiptPO);

		servicePayment.setServiceReceipt(serviceReceiptPO);

		servicePaymentDao.update(servicePayment);

		return 0;
	}

}
