package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
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
import com.fanglin.payment.po.PointofsalesPO;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.payment.po.ServiceReceiptPO;
import com.fanglin.payment.service.PointofsalesService;
import com.fanglin.payment.service.ServicePaymentService;
import com.fanglin.payment.vo.ServicePaymentVO;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
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
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Autowired
	private DecorationService decorationService;
	
	@Autowired
	private PointofsalesService pointofsalesService;
	
	@Override
	public void pageServicePayment(Paging paging, List<Filter> filters, ServicePaymentVO servicePayment, Integer company) {

		if(filters.size() == 0) return;
		
		if (servicePayment != null) servicePayment.filter(filters);

		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.pageServicePayment(paging, filters);
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){
			servicePaymentVOs.add(servicePaymentPOToVO(servicePaymentPO));
		}

		paging.setData(servicePaymentVOs);

	}
	
	@Override
	public List<ServicePaymentVO> queryServicePaymentByOrderId(ServicePaymentVO servicePaymentVO) {
		
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();
		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.queryServicePaymentByOrderId(servicePaymentVO.getDecoration().getOrderId());

		for(ServicePaymentPO servicePaymentPO: servicePaymentPOs){
			ServicePaymentVO _servicePaymentVO = new ServicePaymentVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO(),new DecorationVO(),new ServiceReceiptVO());
			BeanUtil.copyProperties(servicePaymentPO, _servicePaymentVO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
			servicePaymentPO.getDecoration().ptvcascade(servicePaymentVO.getDecoration());
			BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt(), _servicePaymentVO.getServiceReceipt(), Arrays.asList("collecter","confirmer"));
			
			servicePaymentVOs.add(_servicePaymentVO);
		}

		return servicePaymentVOs;
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
	@Transactional(rollbackFor=Exception.class)
	public int collectServicePayment(ServicePaymentVO servicePaymentVO, ServiceReceiptVO serviceReceiptVO, List<Long> posids, String cuid, Integer company) throws FLException {
		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecoration().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}

		DecorationPO decoration = decorationHolonomy.getDecoration();
		
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(new DecorationPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decoration, servicePaymentPO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
		
		UserPO userPO = userDao.queryUserByUserId(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_STYPE_INT);
		servicePaymentPO.setCompany(company);
		
		SystemConfigPO servicePaymentRatio = systemConfigDao.querySystemConfig(String.format("servicePaymentRatio%d", decoration.getType()), decoration.getCompany());
		
		int ratio = servicePaymentRatio != null ? Integer.parseInt(servicePaymentRatio.getValue()) : 1100;

		//应收款
		Long money = servicePaymentVO.getReferMoney();
		//预付款=应收款/服务款比率 
		servicePaymentPO.setAdvanceMoney(Arith.mul(Arith.div(Arith.div(money, ratio), 1000000), 1000000));
		//服务费=应收款-预付款
		servicePaymentPO.setServiceMoney(Arith.sub(money, servicePaymentPO.getAdvanceMoney()));

		//实收服务费 decorationHolonomy.getServicePaidup()  服务费decorationHolonomy.getServicePrice()
		if(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup())>decorationHolonomy.getServicePrice()){
			Long sumMoney = Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup());
			Long subMoney = Arith.sub(sumMoney, decorationHolonomy.getServicePrice());
			servicePaymentPO.setAdvanceMoney(Arith.add(servicePaymentPO.getAdvanceMoney(), subMoney));
			servicePaymentPO.setServiceMoney(Arith.sub(money, servicePaymentPO.getAdvanceMoney()));
		}
		
		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		//生成收据
		generateServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		decorationHolonomy.setMaterialPaidup(Arith.add(servicePaymentPO.getAdvanceMoney(), decorationHolonomy.getMaterialPaidup()));
		decorationHolonomy.setServicePaidup(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup()));
		decorationHolonomyDao.update(decorationHolonomy);

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(decoration.getOrderId());
		if(advancePaymentPO != null){
			advancePaymentPO.setMaterialBalance(Arith.add(advancePaymentPO.getMaterialBalance(), servicePaymentPO.getAdvanceMoney()));
			advancePaymentDao.update(advancePaymentPO);
		}else{
			advancePaymentPO = new AdvancePaymentPO(decoration);
			advancePaymentPO.setBalance(0);
			advancePaymentPO.setProjectBalance(0);
			advancePaymentPO.setMaterialBalance(servicePaymentPO.getAdvanceMoney());
			advancePaymentPO.setZhenglinBalance(0);
			advancePaymentDao.save(advancePaymentPO);
		}

		PaymentPO payment = new PaymentPO(new CustomerPO(), new AdvanceReceiptPO());
		BeanUtil.copyProperties(decoration.getCustomer(), payment.getCustomer());
		payment.setBalance(advancePaymentPO.getMaterialBalance());
		payment.setRecharge(servicePaymentPO.getAdvanceMoney());
		payment.setType(PaymentPO.PAYMENT_TYPE_COLLECTION_INT);
		payment.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT);
		payment.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		payment.setOrderId(servicePaymentPO.getDecoration().getOrderId());
		payment.setCompany(decoration.getCompany());
		payment.setCreater(userPO);
		
		AdvanceReceiptPO advanceReceiptPO = addAdvanceReceipt(servicePaymentPO.getAdvanceMoney(), serviceReceiptVO.getComment(), cuid);

		BeanUtil.copyProperties(advanceReceiptPO, payment.getAdvanceReceipt());
		
		payment.setUniqueid("S" + servicePaymentPO.getServiceReceipt().getSrId());
		paymentDao.save(payment);
		
		servicePaymentPO.setPid(new Long(payment.getPid()).intValue());
		servicePaymentDao.update(servicePaymentPO);
		
		//更新销售点信息
		if(posids != null && posids.size() > 0){
			pointofsalesService.updatePointofsales(posids, servicePaymentPO.getServiceReceipt().getSrId(), PointofsalesPO.STATUS_USED_INT, PointofsalesPO.TYPE_SERVICE_INT);
		}
		
		decorationService.sendMessage(servicePaymentPO.getDecoration().getOrderId(), "装修单", String.format("服务款交款金额%.3f元", Arith.div(money, 1000.0)));

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectServicePaymentForService(ServicePaymentVO servicePaymentVO, ServiceReceiptVO serviceReceiptVO, List<Long> posids, String cuid, Integer company) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecoration().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}
		
		long servicePrice = decorationHolonomy.getServicePrice();
		long currentServicePrice = Arith.add(servicePaymentVO.getReferMoney(), decorationHolonomy.getServicePaidup());
		
		if(currentServicePrice > servicePrice){
			throw new FLException(150025, "款项金额不正确");
		}

		DecorationPO decoration = decorationDao.queryDecorationByOrderId(servicePaymentVO.getDecoration().getOrderId());
		
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(new DecorationPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decoration, servicePaymentPO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
		
		UserPO userPO = userDao.queryUserByUserId(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_STYPE_INT);
		servicePaymentPO.setServiceMoney(servicePaymentVO.getReferMoney());
		servicePaymentPO.setAdvanceMoney(ServicePaymentPO.COLUMN_MONEY_INT);
		servicePaymentPO.setCompany(company);

		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		generateServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		decorationHolonomy.setServicePaidup(Arith.add(servicePaymentPO.getServiceMoney(), decorationHolonomy.getServicePaidup()));
		decorationHolonomyDao.update(decorationHolonomy);
		
		//更新销售点信息
		if(posids != null && posids.size() > 0){
			pointofsalesService.updatePointofsales(posids, servicePaymentPO.getServiceReceipt().getSrId(), PointofsalesPO.STATUS_USED_INT, PointofsalesPO.TYPE_SERVICE_INT);
		}
		
		decorationService.sendMessage(servicePaymentPO.getDecoration().getOrderId(), "装修单", String.format("服务款交款金额%.3f元", Arith.div(servicePaymentPO.getServiceMoney(), 1000.0)));

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundServicePaymentForService(ServicePaymentVO servicePaymentVO, ServiceReceiptVO serviceReceiptVO, String cuid, Integer company) throws FLException {

		DecorationHolonomyPO  decorationHolonomy = decorationHolonomyDao.queryDecorationHolonomyByOrderId(servicePaymentVO.getDecoration().getOrderId());

		if(decorationHolonomy == null){
			throw new FLException(260021, "半价信息不存在");
		}
		
		if(decorationHolonomy.getServicePaidup() <= 0){
			throw new FLException(150025, "款项金额不正确");
		}

		DecorationPO decoration = decorationDao.queryDecorationByOrderId(servicePaymentVO.getDecoration().getOrderId());
		ServicePaymentPO servicePaymentPO = new ServicePaymentPO(new DecorationPO());
		BeanUtil.copyProperties(servicePaymentVO, servicePaymentPO, Arrays.asList("decoration","creater","collecter","confirmer","serviceReceipt"));
		BeanUtil.copyProperties(decoration, servicePaymentPO.getDecoration(), Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter"));
		UserPO userPO = userDao.queryUserByUserId(cuid);
		servicePaymentPO.setCreater(userPO);
		servicePaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_PAIDFORSTATUS_INT);
		servicePaymentPO.setType(ServicePaymentPO.COLUMN_TTYPE_INT);
		servicePaymentPO.setServiceMoney(servicePaymentVO.getReferMoney());
		servicePaymentPO.setAdvanceMoney(ServicePaymentPO.COLUMN_MONEY_INT);
		servicePaymentPO.setCompany(company);

		servicePaymentDao.save(servicePaymentPO);

		servicePaymentVO.setSpid(servicePaymentPO.getSpid());

		generateServicePayment(servicePaymentVO,serviceReceiptVO,cuid);

		decorationHolonomy.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_INT);
		decorationHolonomyDao.update(decorationHolonomy);
		
		decorationService.sendMessage(servicePaymentPO.getDecoration().getOrderId(), "装修单", String.format("服务款退款金额%.3f元", Arith.div(servicePaymentPO.getServiceMoney(), 1000.0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmServicePayment(List<Long> spids,String userId)  throws FLException{

		for (Long spid : spids) {

			ServicePaymentPO servicePayment = servicePaymentDao.get(spid);
			UserPO user = userDao.queryUserByUserId(userId);

			servicePayment.setStatus(ServicePaymentPO.COLUMN_CONFIRMEDSTATUS_INT);
			servicePaymentDao.update(servicePayment);

			ServiceReceiptPO serviceReceiptPO = serviceReceiptDao.queryServiceReceiptBySrId(servicePayment.getServiceReceipt().getSrId());

			serviceReceiptPO.setConfirmer(user);
			serviceReceiptPO.setConfirmerName(user.getUserName());
			serviceReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));
			serviceReceiptDao.update(serviceReceiptPO);
			
			if(servicePayment.getPid() != 0){
				PaymentPO paymentPO = paymentDao.get(Long.valueOf(servicePayment.getPid()));
				AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
				
				advanceReceiptPO.setConfirmer(user);
				advanceReceiptPO.setConfirmerName(user.getUserName());
				advanceReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));
				advanceReceiptPO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_INT);
				
				paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_INT);
				
				paymentDao.update(paymentPO);
				advanceReceiptDao.update(advanceReceiptPO);
			}
		}

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateServicePayment(ServicePaymentVO servicePayment, ServiceReceiptVO serviceReceipt) throws FLException {
		
		long realMoney = 0;

		ServicePaymentPO servicePaymentPO = servicePaymentDao.get(servicePayment.getSpid());

		if (servicePaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		ServiceReceiptPO serviceReceiptPO = servicePaymentPO.getServiceReceipt();
		
		if(servicePaymentPO.getStatus() != 1){
			throw new FLException(150036, "款项状态不可操作");
		}

		Long cash = serviceReceipt.getCash();
		Long bank = serviceReceipt.getBank();
		Long checkv = serviceReceipt.getCheckv();

		if (cash != null && cash != 0) {
			serviceReceiptPO.setCash(cash);
			serviceReceiptPO.setCashInfo(serviceReceipt.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		} else {
			serviceReceiptPO.setCash(0);
			serviceReceiptPO.setCashInfo("");
		}
		
		if (checkv != null && checkv != 0) {
			serviceReceiptPO.setCheckv(checkv);
			serviceReceiptPO.setCheckvBank(serviceReceipt.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		} else {
			serviceReceiptPO.setCheckv(0);
			serviceReceiptPO.setCheckvBank("");
		}
		
		if (bank != null && bank != 0) {
			realMoney = Arith.add(bank, realMoney);
		}
		
		long referMoney = Arith.add(servicePaymentPO.getAdvanceMoney(), servicePaymentPO.getServiceMoney());

		if (referMoney != realMoney) {
			throw new FLException(150025, "款项金额不正确");
		}

		serviceReceiptDao.update(serviceReceiptPO);
	}

	@Transactional(rollbackFor=Exception.class)
	private AdvanceReceiptPO addAdvanceReceipt(Long advanceMoney, String comment, String userId){

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_COLLRCT_INT);
		advanceReceiptPO.setType(AdvanceReceiptPO.STATUS_RECEIPTTYPE_INT);
		
		if(advanceMoney != 0){
			advanceReceiptPO.setTransfer(advanceMoney);
		}
		
		if(comment != null){
			advanceReceiptPO.setComment(comment);
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

		if(serviceReceiptVO.getCash() != null && serviceReceiptVO.getCash() != 0f){ 
			serviceReceiptPO.setCash(serviceReceiptVO.getCash());
			serviceReceiptPO.setCashInfo(serviceReceiptVO.getCashInfo());
		}else{
			serviceReceiptPO.setCash(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setCashInfo("");
		}

		if(serviceReceiptVO.getBank() != null && serviceReceiptVO.getBank() != 0f){
			serviceReceiptPO.setBank(serviceReceiptVO.getBank());
			serviceReceiptPO.setBankInfo(serviceReceiptVO.getBankInfo());
		}else{
			serviceReceiptPO.setBank(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setBankInfo("");
		}

		if(serviceReceiptVO.getCheckv() != null && serviceReceiptVO.getCheckv() != 0f){
			serviceReceiptPO.setCheckv(serviceReceiptVO.getCheckv());
			serviceReceiptPO.setCheckvBank(serviceReceiptVO.getCheckvBank());
		}else{
			serviceReceiptPO.setCheckv(AdvanceReceiptPO.COLUMN_MONEY_INT);
			serviceReceiptPO.setCheckvBank("");
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
	
	public ServicePaymentVO servicePaymentPOToVO(ServicePaymentPO servicePaymentPO){
		ServicePaymentVO servicePaymentVO = new ServicePaymentVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO(),new DecorationVO(),new ServiceReceiptVO(new UserBaseVO(),new UserBaseVO()));
		BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("creater","collecter","confirmer","decoration","serviceReceipt"));
		servicePaymentVO.getCreater().setBaseInfo(servicePaymentPO.getCreater());
		servicePaymentPO.getDecoration().ptvcascade(servicePaymentVO.getDecoration());
		BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt(), servicePaymentVO.getServiceReceipt(), Arrays.asList("collecter","confirmer"));
		BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt().getCollecter(), servicePaymentVO.getServiceReceipt().getCollecter(), Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(servicePaymentPO.getServiceReceipt().getConfirmer(), servicePaymentVO.getServiceReceipt().getConfirmer(), Arrays.asList("dept","duty"));
		return servicePaymentVO;
	}

}
