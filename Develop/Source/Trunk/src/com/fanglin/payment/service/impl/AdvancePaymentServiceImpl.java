/**
 * @File Name		: AdvancePaymentServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
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
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("advancePaymentService")
@Transactional(readOnly=true)
public class AdvancePaymentServiceImpl implements AdvancePaymentService {
	
	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;
	
	@Autowired
	private PaymentDao paymentDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Override
	public List<Float> queryAdvancePaymentByCustomerId(CustomerVO customerVO) {
		
		List<Float> advances = new ArrayList<Float>();
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerVO.getCustomerId());
		
		if(advancePaymentPO != null){
			advances.add(advancePaymentPO.getBalance());
			advances.add(advancePaymentPO.getProjectBalance());
			advances.add(advancePaymentPO.getMaterialBalance());
			advances.add(advancePaymentPO.getZhenglinBalance());
		}else{
			advances = Arrays.asList(new Float[]{0f, 0f, 0f, 0f});
		}
		
		return advances;
	}

	@Override
	public List<Float> queryAdvancePaymentByOrderId(DecorationOrderVO decorationOrderVO) throws FLException {
		
		List<Float> advances = new ArrayList<Float>();	
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(decorationOrderPO.getCustomerPO().getCustomerId());
		
		if(advancePaymentPO != null){
			advances.add(advancePaymentPO.getBalance());
			advances.add(advancePaymentPO.getProjectBalance());
			advances.add(advancePaymentPO.getMaterialBalance());
			advances.add(advancePaymentPO.getZhenglinBalance());
		}else{
			advances = Arrays.asList(new Float[]{0f, 0f, 0f, 0f});
		}
		
		return advances;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAdvancePayment(PaymentVO paymentVO) throws FLException {
		
		float recharge = 0;
		List<String> plusStatus = Arrays.asList(new String[]{PaymentPO.PAYMENT_TYPE_COLLECTION_STR, PaymentPO.PAYMENT_TYPE_REFUND_STR, PaymentPO.PAYMENT_TYPE_CONVERT_STR});
		
		CustomerPO customerPO = customerDao.get(paymentVO.getCustomer().getId());
		
		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCustomerId());
		
		if(advancePaymentPO == null){
			
			advancePaymentPO = new AdvancePaymentPO();
			
			advancePaymentPO.setCustomer(customerPO);
			
			advancePaymentDao.save(advancePaymentPO);
		}
		
		recharge = PaymentServiceImpl.gatherPayment(paymentVO);
		
		float balance = 0;
		String type = paymentVO.getType();
		String paymentType = paymentVO.getPaymentType();
		
		balance = getCustomerBalanceByType(advancePaymentPO, paymentType);

		float overBalance = 0;
		if(plusStatus.contains(type)){
			overBalance = Arith.add(balance, recharge);
		} else {
			if(balance < recharge){
				throw new FLException(130001, "当前客户预付款月不足");
			}
			overBalance = Arith.sub(balance, recharge);
		}
		
		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);
		
		PaymentPO paymentPO = new PaymentPO();
		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		
		advanceReceiptPO.setCash(paymentVO.getCash());
		advanceReceiptPO.setDes(paymentVO.getDes());
		advanceReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		advanceReceiptPO.setStatus((short) AdvanceReceiptPO.STATUS_INIT_INT);
		UserPO userPO = userDao.queryUserByUserId(paymentVO.getCollectUser().getUserId());
		advanceReceiptPO.setCollectUser(userPO);
		advanceReceiptPO.setCollectUserName(userPO.getUserName());
		advanceReceiptPO.setConfirmUserName("");
		
		advanceReceiptDao.save(advanceReceiptPO);
		
		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));

		paymentDao.save(paymentPO);
		
		paymentVO.setPaymentId(paymentPO.getPaymentId());
		
		return 0;
	}
	
	public static void setCustomerBalance(AdvancePaymentPO advancePaymentPO, CustomerVO customerVO){
		
		if(advancePaymentPO == null){
			customerVO.setBalance(0f);
			customerVO.setMaterialBalance(0f);
			customerVO.setProjectBalance(0f);
			customerVO.setZhenglinBalance(0f);
		}else{
			customerVO.setBalance(advancePaymentPO.getBalance());
			customerVO.setMaterialBalance(advancePaymentPO.getMaterialBalance());
			customerVO.setProjectBalance(advancePaymentPO.getProjectBalance());
			customerVO.setZhenglinBalance(advancePaymentPO.getZhenglinBalance());
		}
	}

	public static float getCustomerBalanceByType(AdvancePaymentPO advancePaymentPO, String type){
		float value = 0;
		
		if(type.equals(CustomerPO.BALANCE_TYPE_BALANCE_STR)){
			value = advancePaymentPO.getBalance();
		}else if(type.equals(CustomerPO.BALANCE_TYPE_MATERIAL_STR)){
			value = advancePaymentPO.getMaterialBalance();
		}else if(type.equals(CustomerPO.BALANCE_TYPE_PROJECT_STR)){
			value = advancePaymentPO.getProjectBalance();
		}else if(type.equals(CustomerPO.BALANCE_TYPE_ZHENGLIN_STR)){
			value = advancePaymentPO.getZhenglinBalance();
		}
		
		return value;
	}
	
	public static void setCustomerBalanceByType(AdvancePaymentPO advancePaymentPO, String type, float value){
		
		if(type.equals(CustomerPO.BALANCE_TYPE_BALANCE_STR)){
			advancePaymentPO.setBalance(value);
		}else if(type.equals(CustomerPO.BALANCE_TYPE_MATERIAL_STR)){
			advancePaymentPO.setMaterialBalance(value);
		}else if(type.equals(CustomerPO.BALANCE_TYPE_PROJECT_STR)){
			advancePaymentPO.setProjectBalance(value);
		}else if(type.equals(CustomerPO.BALANCE_TYPE_ZHENGLIN_STR)){
			advancePaymentPO.setZhenglinBalance(value);
		}
	}

}
