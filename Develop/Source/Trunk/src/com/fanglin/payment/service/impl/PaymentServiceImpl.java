/**
 * Title: PaymentServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.dao.CustomerDao;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.service.impl.CustomerServiceImpl;
import com.fanglin.data.vo.CustomerVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
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
	
//	@Autowired
//	private FinanceService financeService;

	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Override
	public void pagePaymentForHistory(Paging paging, List<FilterVO> filters){
		
		if(filters.size() == 0) return;
		
		List<PaymentPO> paymentPOs = paymentDao.pagePaymentForHistory(paging, filters);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
			PaymentVO paymentVO = new PaymentVO();
			
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
			
			BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
			BeanUtil.copyProperties(advanceReceiptPO, paymentVO, Arrays.asList("collectUser", "confirmUser", "status"));

			paymentVO.setCustomer(new CustomerVO());
			BeanUtil.copyProperties(paymentPO.getCustomer(), paymentVO.getCustomer());
			paymentVO.setCustomerId(paymentVO.getCustomer().getCustomerId());
			paymentVO.setCustomerName(paymentVO.getCustomer().getCustomerName());

			paymentVO.setCollectUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getCollectUser(), paymentVO.getCollectUser(), Arrays.asList("role", "dept"));
			paymentVO.setCollectUserName(paymentVO.getCollectUser().getCurrentName());

			paymentVO.setConfirmUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getConfirmUser(), paymentVO.getConfirmUser(), Arrays.asList("role", "dept"));
			
			paymentVOs.add(paymentVO);
		}

		paging.setData(paymentVOs);
	}

	@Override
	public List<PaymentVO> queryPayment(List<FilterVO> filters) {
		
		List<PaymentPO> paymentPOs = paymentDao.queryPayment(filters);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();
		
		for(PaymentPO paymentPO: paymentPOs){
			PaymentVO paymentVO = new PaymentVO();
			
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
			
			BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
			BeanUtil.copyProperties(advanceReceiptPO, paymentVO, Arrays.asList("collectUser", "confirmUser", "status"));

			paymentVO.setCustomer(new CustomerVO());
			BeanUtil.copyProperties(paymentPO.getCustomer(), paymentVO.getCustomer());
			paymentVO.setCustomerId(paymentVO.getCustomer().getCustomerId());
			paymentVO.setCustomerName(paymentVO.getCustomer().getCustomerName());

			paymentVO.setCollectUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getCollectUser(), paymentVO.getCollectUser(), Arrays.asList("role", "dept"));
			paymentVO.setCollectUserName(paymentVO.getCollectUser().getCurrentName());

			paymentVO.setConfirmUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getConfirmUser(), paymentVO.getConfirmUser(), Arrays.asList("role", "dept"));
			
			paymentVOs.add(paymentVO);
		}
		
		return paymentVOs;
	}

	@Override
	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO) {
		
		List<PaymentPO> paymentPOs = paymentDao.queryPaymentByOrderId(paymentVO.getOrderId());
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();
		
		for(PaymentPO paymentPO: paymentPOs){
			PaymentVO _paymentVO = new PaymentVO();
			
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
			
			BeanUtil.copyProperties(paymentPO, _paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
			BeanUtil.copyProperties(advanceReceiptPO, _paymentVO, Arrays.asList("collectUser", "confirmUser", "status"));

			_paymentVO.setCustomer(new CustomerVO());
			BeanUtil.copyProperties(paymentPO.getCustomer(), _paymentVO.getCustomer());
			_paymentVO.setCustomerId(_paymentVO.getCustomer().getCustomerId());
			_paymentVO.setCustomerName(_paymentVO.getCustomer().getCustomerName());

			_paymentVO.setCollectUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getCollectUser(), _paymentVO.getCollectUser(), Arrays.asList("role", "dept"));
			_paymentVO.setCollectUserName(_paymentVO.getCollectUser().getCurrentName());

			_paymentVO.setConfirmUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getConfirmUser(), _paymentVO.getConfirmUser(), Arrays.asList("role", "dept"));
			
			paymentVOs.add(_paymentVO);
		}
		
		return paymentVOs;
	}

	@Override
	public PaymentVO queryPaymentByPaymentId(PaymentVO paymentVO, String userId){
		
		PaymentPO paymentPO = paymentDao.get(paymentVO.getPaymentId());
		
		AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
		
		if(paymentPO != null && userId.equals(advanceReceiptPO.getCollectUser().getUserId())){
			BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
			BeanUtil.copyProperties(advanceReceiptPO, paymentVO, Arrays.asList("collectUser", "confirmUser", "status"));

			paymentVO.setCustomer(new CustomerVO());
			BeanUtil.copyProperties(paymentPO.getCustomer(), paymentVO.getCustomer());
			paymentVO.setCustomerId(paymentVO.getCustomer().getCustomerId());
			paymentVO.setCustomerName(paymentVO.getCustomer().getCustomerName());

			paymentVO.setCollectUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getCollectUser(), paymentVO.getCollectUser(), Arrays.asList("role", "dept"));
			paymentVO.setCollectUserName(paymentVO.getCollectUser().getCurrentName());

			paymentVO.setConfirmUser(new UserVO());
			BeanUtil.copyProperties(advanceReceiptPO.getConfirmUser(), paymentVO.getConfirmUser(), Arrays.asList("role", "dept"));
			
			List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.queryDecorationOrderByCustomerId(paymentPO.getCustomer().getId());
			List<Map<String, String>> decorationOrders = new ArrayList<Map<String,String>>();
			
			for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
				Map<String, String> decorationOrder = new HashMap<String, String>();
				decorationOrder.put("orderId", decorationOrderPO.getOrderId());
				decorationOrder.put("orderAddr", decorationOrderPO.getVillagePO().getVillageName() + " " + decorationOrderPO.getHouseNumber());
				
				if(decorationOrderPO.getDesignerPO() != null){
					decorationOrder.put("designer", decorationOrderPO.getDesignerPO().getCurrentName());
					decorationOrder.put("designerPhone", decorationOrderPO.getDesignerPO().getPhone());
					decorationOrder.put("designerDepartment", decorationOrderPO.getDesignerPO().getDept().getDeptName());
					decorationOrder.put("salesman", decorationOrderPO.getSalesmanPO().getCurrentName());
				}else{
					decorationOrder.put("designer", "");
					decorationOrder.put("designerPhone", "");
					decorationOrder.put("designerDepartment", "");
					decorationOrder.put("salesman", "");
				}
				
				if(decorationOrderPO.getSupervisorPO() != null){
					decorationOrder.put("supervisor", decorationOrderPO.getSupervisorPO().getUserName());
					decorationOrder.put("supervisorPhone", decorationOrderPO.getSupervisorPO().getPhone());
				}else{
					decorationOrder.put("supervisor", "");
					decorationOrder.put("supervisorPhone", "");
				}
				
				decorationOrders.add(decorationOrder);
			}
			
			paymentVO.setOrders(decorationOrders);
		}
		
		return paymentVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectPayment(PaymentVO paymentVO, String userId) throws FLException {
		
		int customerId = paymentVO.getCustomer().getId();
		
		CustomerPO customerPO = customerDao.get(customerId);
		
		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerId);
		
		if(advancePaymentPO == null){
			advancePaymentPO = new AdvancePaymentPO();
			advancePaymentPO.setCustomer(new CustomerPO(customerId));
			
			advancePaymentDao.save(advancePaymentPO);
			
			customerPO.setAdvancePaymentPO(advancePaymentPO);
			
			customerDao.update(customerPO);
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(paymentVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		float balance = 0;
		float recharge = gatherPayment(paymentVO);
		String type = paymentVO.getType();
		String paymentType = paymentVO.getPaymentType();
		
		List<String> paymentTypes = Arrays.asList(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR, PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR, PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR, PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_STR);
		
		balance = CustomerServiceImpl.getCustomerBalanceByType(customerPO, paymentType);

		float overBalance = 0;
		
		if(!paymentTypes.contains(paymentType)){
			throw new FLException(150028, "预付款类型错误");
		}
		
//		if((PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(paymentType) || PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR.equals(paymentType)) && decorationOrderPO.getDecorationActivityPO() == null){
//			throw new FLException(150015, "收款对应订单没有参加活动,不能收取合同/工程预付款");
//		}
		
		if(!PaymentPO.PAYMENT_TYPE_COLLECTION_STR.equals(type)){
			throw new FLException(150016, "预付款操作不正确");
		}
		
		overBalance = Arith.add(balance, recharge);
		
		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		
		CustomerServiceImpl.setCustomerBalanceByType(customerPO, paymentType, overBalance);
		
		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status"));
		
		advanceReceiptPO.setCollectUser(new UserPO(userId));
		
		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));
		
		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		
		advanceReceiptDao.save(advanceReceiptPO);
		paymentDao.save(paymentPO);
		
		paymentVO.setPaymentId(paymentPO.getPaymentId());
			
		if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(paymentType)){
			List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_QUOTATION_STR});
			
			if(status.contains(decorationOrderPO.getStatus())){
				decorationOrderPO.setStatus(DecorationOrderPO.STATUS_DEPOSIT_STR);
				decorationOrderPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
			}
			
			decorationOrderDao.update(decorationOrderPO);
		}
			
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmPayment(List<Integer> paymentIds, String currentUserId) throws FLException{
		
		for(Integer paymentId: paymentIds){
			PaymentPO paymentPO = paymentDao.get(paymentId);
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
			
			if(paymentPO == null || PaymentPO.PAYMENT_STATUS_CONFIRMED_STR.equals(paymentPO.getStatus())){ // 如果是已撤销或已确认不做动作
				continue;
			}
			
			String type = paymentPO.getType();
			
			if(PaymentPO.PAYMENT_CONVERT_OUT_STR.equals(type) || PaymentPO.PAYMENT_CONVERT_IN_STR.equals(type)){
				String tempRelativeId = paymentPO.getDes().split("-")[1];
				Integer relativeId = Integer.valueOf(tempRelativeId.substring(0, tempRelativeId.length() - 1));
				
				PaymentPO relativePO = paymentDao.get(relativeId);
				AdvanceReceiptPO relativeReceiptPO = relativePO.getAdvanceReceipt();
				
				relativeReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				relativeReceiptPO.setConfirmUser(new UserPO(currentUserId));
				relativePO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_STR);
				
				advanceReceiptDao.update(relativeReceiptPO);
				paymentDao.update(relativePO);
			}
			
			advanceReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
			advanceReceiptPO.setConfirmUser(new UserPO(currentUserId));
			paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_STR);
			
			if(advanceReceiptPO.getStatus() != AdvanceReceiptPO.STATUS_CONFIRM_INT){
				advanceReceiptPO.setStatus((short) AdvanceReceiptPO.STATUS_CONFIRM_INT);
				
//				DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(paymentPO.getOrderId());
				
//				financeService.buildAdvanceFinance(decorationOrderPO, advanceReceiptPO, new UserPO(currentUserId));
			}
			
			advanceReceiptDao.update(advanceReceiptPO);
			paymentDao.update(paymentPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updatePayment(PaymentVO paymentVO){
		
		PaymentPO paymentPO = paymentDao.get(paymentVO.getPaymentId());
		AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();
		
		if(paymentPO != null){
			
			Float cash = paymentVO.getCash();
			Float bank = paymentVO.getBank();
			Float checkv = paymentVO.getCheckv();
			Float installment = paymentVO.getInstallment();
			Float accounts = paymentVO.getAccounts();
			
			if(cash != null && cash != 0){
				advanceReceiptPO.setCash(paymentVO.getCash());
				advanceReceiptPO.setCashInfo(paymentVO.getCashInfo());
			}else{
				advanceReceiptPO.setCash(0);
				advanceReceiptPO.setCashInfo("");
			}
			if(bank != null && bank != 0){
				advanceReceiptPO.setBank(bank);
				advanceReceiptPO.setBankInfo(paymentVO.getBankInfo());
			}else{
				advanceReceiptPO.setBank(0);
				advanceReceiptPO.setBankInfo("");
			}
			if(checkv != null && checkv != 0){
				advanceReceiptPO.setCheckv(checkv);
				advanceReceiptPO.setCheckvBankName(paymentVO.getCheckvBankName());
			}else{
				advanceReceiptPO.setCheckv(0);
				advanceReceiptPO.setCheckvBankName("");
			}
			if(installment != null && installment != 0){
				advanceReceiptPO.setInstallment(installment);
				advanceReceiptPO.setInstallmentBankName(paymentVO.getInstallmentBankName());
			}else{
				advanceReceiptPO.setInstallment(0);
				advanceReceiptPO.setInstallmentBankName("");
			}
			if(accounts != null && accounts != 0){
				advanceReceiptPO.setAccounts(accounts);
				advanceReceiptPO.setAccountsBankName(paymentVO.getAccountsBankName());
			}else{
				advanceReceiptPO.setAccounts(0);
				advanceReceiptPO.setAccountsBankName("");
			}
			
			paymentPO.setDes(paymentVO.getDes());
		}
		
		paymentDao.update(paymentPO);
		advanceReceiptDao.update(advanceReceiptPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int withdrawPayment(PaymentVO paymentVO, String userId) throws FLException {
		
		CustomerPO customerPO = customerDao.get(paymentVO.getCustomer().getId());
		
		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}
		
		float balance = 0;
		float recharge = gatherPayment(paymentVO);
		String type = paymentVO.getType();
		String paymentType = paymentVO.getPaymentType();
		
		balance = CustomerServiceImpl.getCustomerBalanceByType(customerPO, paymentType);
		
		float overBalance = 0;
		if(PaymentPO.PAYMENT_TYPE_EXTRACT_STR.equals(type)){
			
			if(balance < recharge){
				throw new FLException(150017, "预付款提款金额不足");
			}
			
			overBalance = Arith.sub(balance, recharge);
			
			paymentVO.setRecharge(Math.abs(recharge));
			paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

			CustomerServiceImpl.setCustomerBalanceByType(customerPO, paymentType, overBalance);
			
			AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
			BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status"));
			
			advanceReceiptPO.setCollectUser(new UserPO(userId));
			
			advanceReceiptDao.save(advanceReceiptPO);
			
			PaymentPO paymentPO = new PaymentPO();
			BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));
			
			paymentPO.setCustomer(customerPO);
			paymentPO.setBalance(overBalance);
			paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
			paymentPO.setAdvanceReceipt(advanceReceiptPO);
			
			paymentDao.save(paymentPO);
			
			paymentVO.setPaymentId(paymentPO.getPaymentId());
		}else{
			throw new FLException(150016, "预付款类型不正确");
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int convertPayment(PaymentVO paymentVO, String convertLeftType, String convertRightType, float convertCash, String operatorId) throws FLException{
		
		String orderId = paymentVO.getOrderId();
		
		CustomerPO customerPO = customerDao.get(paymentVO.getCustomer().getId());
		
		float nowLeftBalance = CustomerServiceImpl.getCustomerBalanceByType(customerPO, convertLeftType);
		float nowRightBalance = CustomerServiceImpl.getCustomerBalanceByType(customerPO, convertRightType);
		
		if(nowLeftBalance < convertCash){
			throw new FLException(150018, "预付款转换余额不足");
		}
		
		float convertLeftVal = Arith.sub(nowLeftBalance, convertCash);
		float convertRightVal = Arith.add(nowRightBalance, convertCash);
		
		CustomerServiceImpl.setCustomerBalanceByType(customerPO, convertLeftType, convertLeftVal);
		CustomerServiceImpl.setCustomerBalanceByType(customerPO, convertRightType, convertRightVal);
		
		PaymentPO leftPaymentPO = new PaymentPO();
		AdvanceReceiptPO leftReceiptPO = new AdvanceReceiptPO();
		
		leftReceiptPO.setCash(convertCash);
		leftReceiptPO.setCollectUser(new UserPO(operatorId));
		leftReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		
		advanceReceiptDao.save(leftReceiptPO);
		
		leftPaymentPO.setCustomer(customerPO);
		leftPaymentPO.setOrderId(orderId);
		leftPaymentPO.setBalance(convertLeftVal);
		leftPaymentPO.setRecharge(convertCash);
		leftPaymentPO.setType(PaymentPO.PAYMENT_CONVERT_OUT_STR);
		leftPaymentPO.setPaymentType(convertLeftType);
		leftPaymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		leftPaymentPO.setAdvanceReceipt(leftReceiptPO);
		
		paymentDao.save(leftPaymentPO);
		Integer leftPaymentId = leftPaymentPO.getPaymentId();
		
		PaymentPO rightPaymentPO = new PaymentPO();
		AdvanceReceiptPO rightReceiptPO = new AdvanceReceiptPO();
		
		rightReceiptPO.setCash(convertCash);
		rightReceiptPO.setCollectUser(new UserPO(operatorId));
		rightReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		
		advanceReceiptDao.save(rightReceiptPO);
		
		rightPaymentPO.setCustomer(customerPO);
		rightPaymentPO.setOrderId(orderId);
		rightPaymentPO.setBalance(convertRightVal);
		rightPaymentPO.setRecharge(convertCash);
		rightPaymentPO.setType(PaymentPO.PAYMENT_CONVERT_IN_STR);
		rightPaymentPO.setPaymentType(convertRightType);
		rightPaymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		rightPaymentPO.setAdvanceReceipt(rightReceiptPO);
		
		paymentDao.save(rightPaymentPO);
		Integer rightPaymentId = rightPaymentPO.getPaymentId();
		
		leftPaymentPO.setDes(String.format("%s转入%s:%f元(关联预付款编号-%s)", convertLeftType, convertRightType, convertCash, rightPaymentId));
		rightPaymentPO.setDes(String.format("%s转入%s:%f元(关联预付款编号-%s)", convertLeftType, convertRightType, convertCash, leftPaymentId));
		
		return 0;
	}
	
	public static float gatherPayment(PaymentVO paymentVO){
		
		float recharge = 0;
		
		Float cash = paymentVO.getCash();
		Float bank = paymentVO.getBank();
		Float checkv = paymentVO.getCheckv();
		Float installment = paymentVO.getInstallment();
		Float accounts = paymentVO.getAccounts();
		
		if(cash != null){
			recharge = Arith.add(cash, recharge);
		}
		if(bank != null){
			recharge = Arith.add(bank, recharge);
		}
		if(checkv != null){
			recharge = Arith.add(checkv, recharge);
		}
		if(installment != null){
			recharge = Arith.add(installment, recharge);
		}
		if(accounts != null){
			recharge = Arith.add(accounts, recharge);
		}
		
		return recharge;
	}

}
