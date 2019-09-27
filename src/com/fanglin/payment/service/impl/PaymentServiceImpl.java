/**
 * Title: PaymentServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("paymentService")
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationService decorationService;
	
	@Override
	public void pagePaymentForCollect(Paging paging, List<Filter> filters, int company) {
		
		if(filters.size() == 0) return;
		
		filters.add(new Filter("status", String.valueOf(PaymentPO.PAYMENT_STATUS_PAID_INT), "eq"));

		List<PaymentPO> paymentPOs = paymentDao.pagePaymentForHistory(paging, filters, company);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
			paymentVOs.add(paymentPOToVO(paymentPO));
		}

		paging.setData(paymentVOs);
		
	}


	@Override
	public void pagePaymentForConfirm(Paging paging, List<Filter> filters, int company) {
		
		if(filters.size() == 0) return;
		
		filters.add(new Filter("status", String.valueOf(PaymentPO.PAYMENT_STATUS_CONFIRMED_INT), "eq"));

		List<PaymentPO> paymentPOs = paymentDao.pagePaymentForHistory(paging, filters, company);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
			paymentVOs.add(paymentPOToVO(paymentPO));
		}

		paging.setData(paymentVOs);
		
	}

	@Override
	public void pagePaymentForHistory(Paging paging, List<Filter> filters, int company){

		if(filters.size() == 0) return;

		List<PaymentPO> paymentPOs = paymentDao.pagePaymentForHistory(paging, filters, company);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
			paymentVOs.add(paymentPOToVO(paymentPO));
		}

		paging.setData(paymentVOs);
	}


	@Override
	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO) {

		List<PaymentPO> paymentPOs = paymentDao.queryPaymentByOrderId(paymentVO.getOrderId());
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
			paymentVOs.add(paymentPOToVO(paymentPO));
		}

		return paymentVOs;
	}

	@Override
	public PaymentVO queryPaymentByPaymentId(PaymentVO paymentVO, String userId) throws FLException{

		PaymentPO paymentPO = paymentDao.get(paymentVO.getPid());

		if(paymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

		if(advanceReceiptPO == null){
			throw new FLException(150026, "收据不存在");
		}

		if(!userId.equals(advanceReceiptPO.getCollecter().getUserId())){
			throw new FLException(150014, "收款人不匹配");
		}
		
		PaymentVO payment = paymentPOToVO(paymentPO);

		return payment;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectPayment(PaymentVO paymentVO, String userId) throws FLException {

		long customerId = paymentVO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(customerId, decorationPO.getCompany());

		if(advancePaymentPO == null){
			advancePaymentPO = new AdvancePaymentPO();
			advancePaymentPO.setCustomer(new CustomerPO(customerId));
			advancePaymentPO.setCompany(decorationPO.getCompany());
		}		

		long balance = 0;
		long recharge = gatherPayment(paymentVO);
		Short type = paymentVO.getType();
		Short paymentType = paymentVO.getPaymentType();
		
		//合同预付款   主材预付款 
		List<Short> paymentTypes = Arrays.asList(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT);

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		long overBalance = 0;

		if(!paymentTypes.contains(paymentType)){
			throw new FLException(150028, "预付款类型错误");
		}
		
		//如果类型不是收款
		if(PaymentPO.PAYMENT_TYPE_COLLECTION_INT != type){
			throw new FLException(150016, "预付款操作不正确");
		}

		overBalance = Arith.add(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		
		//设置当前款项类型的预付款(advancePayment)的余额
		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status", "type"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));

		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		advancePaymentDao.saveOrUpdate(advancePaymentPO);
		advanceReceiptDao.save(advanceReceiptPO);
		paymentDao.save(paymentPO);

		paymentVO.setPid(paymentPO.getPid());

		if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT == paymentType){

			if(decorationPO.getStatus() == DecorationPO.STATUS_INIT_INT){
				decorationPO.setStatus(DecorationPO.STATUS_DEPOSIT_INT);
				decorationPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
			}

			decorationDao.update(decorationPO);
		}
		
		if(paymentPO.getPaymentType() == 0){
			decorationService.sendMessage(paymentPO.getOrderId(), "装修单", String.format("合同预付款金额%.3f元", Arith.div(paymentPO.getRecharge(), 1000.0)));
		}else if(paymentPO.getPaymentType() == 2){
			decorationService.sendMessage(paymentPO.getOrderId(), "主材单", String.format("主材预付款金额%.3f元", Arith.div(paymentPO.getRecharge(), 1000.0)));
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmPayment(List<Long> paymentIds, String currentUserId) throws FLException{

		for(Long paymentId: paymentIds){
			PaymentPO paymentPO = paymentDao.get(paymentId);
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

			if(paymentPO == null || PaymentPO.PAYMENT_STATUS_CONFIRMED_INT == paymentPO.getStatus()){ // 如果是已撤销或已确认不做动作
				continue;
			}

			advanceReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
			UserPO user = userDao.queryUserByUserId(currentUserId);
			advanceReceiptPO.setConfirmer(user);
			advanceReceiptPO.setConfirmerName(user.getUserName());
			paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_INT);

			if(advanceReceiptPO.getStatus() != AdvanceReceiptPO.STATUS_CONFIRM_INT){
				advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_CONFIRM_INT);
			}

			advanceReceiptDao.update(advanceReceiptPO);
			paymentDao.update(paymentPO);
		}

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int withdrawPayment(PaymentVO paymentVO, String userId) throws FLException {

		long customerId = paymentVO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(customerId, decorationPO.getCompany());

		if(advancePaymentPO == null){
			throw new FLException(150010, "预付款余额不足");
		}

		long balance = 0;
		long recharge = gatherPayment(paymentVO);
		Short paymentType = paymentVO.getPaymentType();

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		long overBalance = 0;

		if(balance < recharge){
			throw new FLException(150010, "预付款余额不足");
		}

		overBalance = Arith.sub(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status", "type"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "type"));

		paymentPO.setCustomer(customerPO);
		paymentPO.setBalance(overBalance);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_EXTRACT_INT);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());
		

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		paymentVO.setPid(paymentPO.getPid());
		
		String name = "";
		if(paymentPO.getPaymentType() == 0){
			name = "合同预付款";
		}else if(paymentPO.getPaymentType() == 2){
			name = "主材预付款";
		}
		
		decorationService.sendMessage(paymentPO.getOrderId(), name, String.format("%s退款金额%.3f元", name, Arith.div(paymentPO.getRecharge(), 1000.0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int payPayment(PaymentVO paymentVO, String userId) throws FLException{

		DecorationPO decorationPO =  decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		long customerId = decorationPO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(customerId, decorationPO.getCompany());

		if(advancePaymentPO == null){
			throw new FLException(150010, "预付款余额不足");
		}

		long balance = 0;
		long recharge = gatherPayment(paymentVO);
		Short paymentType = paymentVO.getPaymentType();

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		long overBalance = 0;

		if(balance < recharge){
			throw new FLException(150010, "预付款余额不足");
		}

		overBalance = Arith.sub(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "type"));

		paymentPO.setCustomer(customerPO);
		paymentPO.setBalance(overBalance);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_INT);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		paymentVO.setPid(paymentPO.getPid());

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePayment(PaymentVO paymentVO) throws FLException{
		
		long realMoney = 0;

		PaymentPO paymentPO = paymentDao.get(paymentVO.getPid());
		
		if(paymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
		
		if(PaymentPO.PAYMENT_STATUS_PAID_INT != paymentPO.getStatus()){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		Long cash = paymentVO.getCash();
		Long bank = paymentVO.getBank();
		Long checkv = paymentVO.getCheckv();

		if(cash != null && cash != 0){
			advanceReceiptPO.setCash(paymentVO.getCash());
			advanceReceiptPO.setCashInfo(paymentVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}else{
			advanceReceiptPO.setCash(0);
			advanceReceiptPO.setCashInfo("");
		}
		
		if(bank != null && bank != 0){
			advanceReceiptPO.setBank(bank);
			advanceReceiptPO.setBankInfo(paymentVO.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		}else{
			advanceReceiptPO.setBank(0);
			advanceReceiptPO.setBankInfo("");
		}
		
		if(checkv != null && checkv != 0){
			advanceReceiptPO.setCheckv(checkv);
			advanceReceiptPO.setCheckvBank(paymentVO.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		}else{
			advanceReceiptPO.setCheckv(0);
			advanceReceiptPO.setCheckvBank("");
		}
		
		if(paymentPO.getRecharge() != realMoney){
			throw new FLException(150025, "款项金额不正确");
		}
		
		advanceReceiptDao.update(advanceReceiptPO);

		return 0;
	}

	//计算各个付款方式总共的操作金额
	public static long gatherPayment(PaymentVO paymentVO){

		long recharge = 0;

		Long cash = paymentVO.getCash();
		Long bank = paymentVO.getBank();
		Long checkv = paymentVO.getCheckv();
		Long transfer = paymentVO.getTransfer();

		if(cash != null){
			recharge = Arith.add(cash, recharge);
		}
		
		if(bank != null){
			recharge = Arith.add(bank, recharge);
		}
		
		if(checkv != null){
			recharge = Arith.add(checkv, recharge);
		}
		
		if(transfer != null){
			recharge = Arith.add(transfer, recharge);
		}

		return recharge;
	}

	public static PaymentVO advancePaymentBalance(String paymentName, Long advance, Short _paymentType, Long customerAdvance, String userId, Long customerId, AdvancePaymentPO advancePaymentPO, String orderId) throws FLException{
		
		PaymentVO paymentVO = new PaymentVO();
		
		if(customerAdvance < advance){
			throw new FLException(150010, "预付款余额不足");
		}else{
			paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_INT); //付款
			paymentVO.setTransfer(advance);
			
			String newPaymentType = "";
			switch (_paymentType) {
			case 0:
				newPaymentType = "合同预付款";
				break;				
			case 1:
				newPaymentType = "工程预付款";		
				break;				
			case 2:
				newPaymentType = "主材预付款";
				break;
			case 3:
				newPaymentType = "正林预付款";
				break;
			}
			
			if(paymentName.equals(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR)){
				paymentVO.setComment(String.format("装修订单号:%s,付款类型:%s", orderId, newPaymentType));
			}else if(paymentName.equals(PaymentPO.PAYMENT_MATERIAL_PAYMENTNAME_STR)){
				paymentVO.setComment(String.format("主材订单号:%s,付款类型:%s", orderId, newPaymentType));
			}
			
			paymentVO.setCollectUser(new UserBaseVO(userId));
			paymentVO.setCustomer(new CustomerVO(customerId));
			paymentVO.setPaymentType(_paymentType);
			paymentVO.setOrderId(orderId);
			paymentVO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
			
			if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT == _paymentType){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getBalance(), advance));
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_INT == _paymentType){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getProjectBalance(), advance));
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT == _paymentType){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getMaterialBalance(), advance));
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_INT == _paymentType){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getZhenglinBalance(), advance));
			}
		}
		
		return paymentVO;
	}
	
	public PaymentVO paymentPOToVO(PaymentPO paymentPO){
		
		PaymentVO paymentVO = new PaymentVO();

		AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

		BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
		BeanUtil.copyProperties(advanceReceiptPO, paymentVO, Arrays.asList("customer","collectUser", "confirmUser","status","type"));

		paymentVO.setCustomer(new CustomerVO());
		BeanUtil.copyProperties(paymentPO.getCustomer(), paymentVO.getCustomer());

		paymentVO.setCollectUser(new UserBaseVO());
		BeanUtil.copyProperties(advanceReceiptPO.getCollecter(), paymentVO.getCollectUser(), Arrays.asList("dept", "duty"));

		paymentVO.setConfirmUser(new UserBaseVO());
		BeanUtil.copyProperties(advanceReceiptPO.getConfirmer(), paymentVO.getConfirmUser(), Arrays.asList("dept", "duty"));
		
		return paymentVO;
		
	}
}
