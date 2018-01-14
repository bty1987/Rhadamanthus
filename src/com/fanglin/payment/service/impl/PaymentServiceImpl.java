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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
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

	@Override
	public void pagePaymentForHistory(Paging paging, List<Filter> filters, int company){

		if(filters.size() == 0) return;

		List<PaymentPO> paymentPOs = paymentDao.pagePaymentForHistory(paging, filters,company);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
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

			paymentVOs.add(paymentVO);
		}

		paging.setData(paymentVOs);
	}


	@Override
	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO) {

		List<PaymentPO> paymentPOs = paymentDao.queryPaymentByOrderId(paymentVO.getOrderId());
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for(PaymentPO paymentPO: paymentPOs){
			PaymentVO _paymentVO = new PaymentVO();

			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

			BeanUtil.copyProperties(paymentPO, _paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
			BeanUtil.copyProperties(advanceReceiptPO, _paymentVO, Arrays.asList("collectUser", "confirmUser", "status","type"));

			_paymentVO.setCustomer(new CustomerVO());
			BeanUtil.copyProperties(paymentPO.getCustomer(), _paymentVO.getCustomer());

			_paymentVO.setCollectUser(new UserBaseVO());
			BeanUtil.copyProperties(advanceReceiptPO.getCollecter(), _paymentVO.getCollectUser(), Arrays.asList("dept", "duty"));

			_paymentVO.setConfirmUser(new UserBaseVO());
			BeanUtil.copyProperties(advanceReceiptPO.getConfirmer(), _paymentVO.getConfirmUser(), Arrays.asList("dept", "duty"));

			paymentVOs.add(_paymentVO);
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

		BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser"));
		BeanUtil.copyProperties(advanceReceiptPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser","status","type"));

		paymentVO.setCustomer(new CustomerVO());
		BeanUtil.copyProperties(paymentPO.getCustomer(), paymentVO.getCustomer());

		paymentVO.setCollectUser(new UserBaseVO());
		BeanUtil.copyProperties(advanceReceiptPO.getCollecter(), paymentVO.getCollectUser(), Arrays.asList("dept", "duty"));

		paymentVO.setConfirmUser(new UserBaseVO());
		BeanUtil.copyProperties(advanceReceiptPO.getConfirmer(), paymentVO.getConfirmUser(), Arrays.asList("dept", "duty"));

		return paymentVO;
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

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(customerId,decorationPO.getCompany());

		if(advancePaymentPO == null){
			advancePaymentPO = new AdvancePaymentPO();
			advancePaymentPO.setCustomer(new CustomerPO(customerId));
			advancePaymentPO.setCompany(decorationPO.getCompany());
		}		

		float balance = 0;
		float recharge = gatherPayment(paymentVO);
		String type = paymentVO.getType();
		String paymentType = paymentVO.getPaymentType();

		List<String> paymentTypes = Arrays.asList(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR, PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR, PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR, PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_STR);

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		float overBalance = 0;

		if(!paymentTypes.contains(paymentType)){
			throw new FLException(150028, "预付款类型错误");
		}

		if(!PaymentPO.PAYMENT_TYPE_COLLECTION_STR.equals(type)){
			throw new FLException(150016, "预付款操作不正确");
		}

		overBalance = Arith.add(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status","type"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));

		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setCompany(decorationPO.getCompany());

		advancePaymentDao.saveOrUpdate(advancePaymentPO);
		advanceReceiptDao.save(advanceReceiptPO);
		paymentDao.save(paymentPO);

		paymentVO.setPid(paymentPO.getPid());

		if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(paymentType)){
			List<String> status = Arrays.asList(new String[]{DecorationPO.STATUS_INIT_STR, DecorationPO.STATUS_QUOTATION_STR});

			if(status.contains(decorationPO.getStatus())){
				decorationPO.setStatus(DecorationPO.STATUS_DEPOSIT_STR);
				decorationPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
			}

			decorationDao.update(decorationPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmPayment(List<Long> paymentIds, String currentUserId) throws FLException{

		for(Long paymentId: paymentIds){
			PaymentPO paymentPO = paymentDao.get(paymentId);
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

			if(paymentPO == null || PaymentPO.PAYMENT_STATUS_CONFIRMED_STR.equals(paymentPO.getStatus())){ // 如果是已撤销或已确认不做动作
				continue;
			}

			String type = paymentPO.getType();

			if(PaymentPO.PAYMENT_CONVERT_OUT_STR.equals(type) || PaymentPO.PAYMENT_CONVERT_IN_STR.equals(type)){
				String tempRelativeId = paymentPO.getComment().split("-")[1];
				Integer relativeId = Integer.valueOf(tempRelativeId.substring(0, tempRelativeId.length() - 1));

				PaymentPO relativePO = paymentDao.get(relativeId);
				AdvanceReceiptPO relativeReceiptPO = relativePO.getAdvanceReceipt();

				relativeReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				UserPO user = userDao.queryUserByUserId(currentUserId);
				relativeReceiptPO.setConfirmer(user);
				relativePO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_STR);

				advanceReceiptDao.update(relativeReceiptPO);
				paymentDao.update(relativePO);
			}

			advanceReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
			UserPO user = userDao.queryUserByUserId(currentUserId);
			advanceReceiptPO.setConfirmer(user);
			paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_STR);

			if(advanceReceiptPO.getStatus() != AdvanceReceiptPO.STATUS_CONFIRM_INT){
				advanceReceiptPO.setStatus((short) AdvanceReceiptPO.STATUS_CONFIRM_INT);
			}

			advanceReceiptDao.update(advanceReceiptPO);
			paymentDao.update(paymentPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePayment(PaymentVO paymentVO){

		PaymentPO paymentPO = paymentDao.get(paymentVO.getPid());
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
				advanceReceiptPO.setCheckvBank(paymentVO.getCheckvBank());
			}else{
				advanceReceiptPO.setCheckv(0);
				advanceReceiptPO.setCheckvBank("");
			}
			if(installment != null && installment != 0){
				advanceReceiptPO.setInstallment(installment);
				advanceReceiptPO.setInstallmentBank(paymentVO.getInstallmentBank());
			}else{
				advanceReceiptPO.setInstallment(0);
				advanceReceiptPO.setInstallmentBank("");
			}
			if(accounts != null && accounts != 0){
				advanceReceiptPO.setAccounts(accounts);
				advanceReceiptPO.setAccountsBank(paymentVO.getAccountsBank());
			}else{
				advanceReceiptPO.setAccounts(0);
				advanceReceiptPO.setAccountsBank("");
			}

			paymentPO.setComment(paymentVO.getComment());
		}

		paymentDao.update(paymentPO);
		advanceReceiptDao.update(advanceReceiptPO);

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

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(customerId,decorationPO.getCompany());

		if(advancePaymentPO == null){
			throw new FLException(150010, "预付款余额不足");
		}

		float balance = 0;
		float recharge = gatherPayment(paymentVO);
		String paymentType = paymentVO.getPaymentType();

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		float overBalance = 0;

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
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_STR);
		paymentPO.setCompany(decorationPO.getCompany());

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		paymentVO.setPid(paymentPO.getPid());

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

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(customerId,decorationPO.getCompany());

		if(advancePaymentPO == null){
			throw new FLException(150010, "预付款余额不足");
		}

		float balance = 0;
		float recharge = gatherPayment(paymentVO);
		String paymentType = paymentVO.getPaymentType();

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		float overBalance = 0;

		if(balance < recharge){
			throw new FLException(150010, "预付款余额不足");
		}

		overBalance = Arith.sub(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status","type"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "type"));

		paymentPO.setCustomer(customerPO);
		paymentPO.setBalance(overBalance);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_EXTRACT_STR);
		paymentPO.setCompany(decorationPO.getCompany());

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		paymentVO.setPid(paymentPO.getPid());

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

	public static PaymentVO advancePaymentBalance(String paymentName,Float advance,String _paymentType,Float customerAdvance,String userId,Long customerId,AdvancePaymentPO advancePaymentPO, String orderId) throws FLException{
		
		PaymentVO paymentVO = new PaymentVO();
		
		if(customerAdvance < advance){
			throw new FLException(150010, "预付款余额不足");
		}else{
			paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_STR);
			paymentVO.setCash(advance);
			
			if(paymentName.equals(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR)){
				paymentVO.setComment(String.format("装修订单号:%s,付款类型:%s", orderId, _paymentType));
			}else if(paymentName.equals(PaymentPO.PAYMENT_MATERIAL_PAYMENTNAME_STR)){
				paymentVO.setComment(String.format("主材订单号:%s,付款类型:%s", orderId, _paymentType));
			}
			paymentVO.setCollectUser(new UserBaseVO(userId));
			paymentVO.setCustomer(new CustomerVO(customerId));
			paymentVO.setPaymentType(_paymentType);
			paymentVO.setOrderId(orderId);
			paymentVO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
			
			if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(_paymentType)){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getBalance(), advance));
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR.equals(_paymentType)){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getProjectBalance(), advance));
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR.equals(_paymentType)){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getMaterialBalance(), advance));
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_STR.equals(_paymentType)){
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getZhenglinBalance(), advance));
			}
		}
		
		return paymentVO;
	}
}
