/**
 * Title: CustomerServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.service.CustomerService;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.impl.PaymentServiceImpl;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerService")
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private PaymentDao paymentDao;
	
	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Override
	public void pageCustomer(Paging paging, List<FilterVO> filters){

		List<CustomerPO> customerPOs = customerDao.pageCustomer(paging, filters);
		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();

		for(CustomerPO customerPO : customerPOs){
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(customerPO, customerVO);
			
			customerVOs.add(customerVO);
		}

		paging.setData(customerVOs);
	}
	
	@Override
	public CustomerVO queryCustomerById(CustomerVO customerVO){

		CustomerPO customerPO = customerDao.get(customerVO.getId());
		
		if(customerPO != null){
			customerVO = new CustomerVO();
			
			BeanUtil.copyProperties(customerPO, customerVO);
		}

		return customerVO;
	}
	
	@Override
	public List<Float> queryCustomerForAdvanceByCustomerId(CustomerVO customerVO){
		
		List<Float> advances = new ArrayList<Float>();
		
		CustomerPO customerPO = customerDao.queryCustomerByCustomerId(customerVO.getCustomerId());
		
		if(customerPO != null && customerPO.getAdvancePaymentPO() != null){
			
			AdvancePaymentPO advancePaymentPO = customerPO.getAdvancePaymentPO();
			
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
	public List<CustomerVO> queryCustomerForName(String pinyinName){

		Paging paging = new Paging(0, 50);

		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();
		List<CustomerPO> customerPOs = customerDao.queryCustomerForNameByPinyin(paging, pinyinName);
		
		for(CustomerPO customerPO: customerPOs){
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(customerPO, customerVO);
			
			customerVOs.add(customerVO);
		}
		return customerVOs;
	}
	
	@Override
	public Set<Integer> checkCustomerForPhone(CustomerVO customerVO){
		Set<Integer> customerIds = new HashSet<Integer>();
		List<CustomerPO> customerPOs = new ArrayList<CustomerPO>();
		
		String[] array = customerVO.getPhone().split(",");
		Set<String> set = new HashSet<String>();
		
		set.addAll(Arrays.asList(array));
		
		for(String phone: set){
			customerPOs = customerDao.queryCustomerByPhone(phone);
			for(CustomerPO customerPO: customerPOs){
				customerIds.add(customerPO.getId());
			}
		}
		
		return customerIds;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCustomerForBalance(PaymentVO paymentVO) throws FLException {
		float recharge = 0;
		List<String> plusStatus = Arrays.asList(new String[]{PaymentPO.PAYMENT_TYPE_COLLECTION_STR, PaymentPO.PAYMENT_TYPE_REFUND_STR, PaymentPO.PAYMENT_TYPE_CONVERT_STR});
		
		CustomerPO customerPO = customerDao.get(paymentVO.getCustomer().getId());
		
		if(customerPO.getAdvancePaymentPO() == null){
			
			AdvancePaymentPO advancePaymentPO = new AdvancePaymentPO();
			
			advancePaymentPO.setCustomer(customerPO);
			
			advancePaymentDao.save(advancePaymentPO);
			
			customerPO.setAdvancePaymentPO(advancePaymentPO);
		}
		
		recharge = PaymentServiceImpl.gatherPayment(paymentVO);
		
		float balance = 0;
		String type = paymentVO.getType();
		String paymentType = paymentVO.getPaymentType();
		
		balance = getCustomerBalanceByType(customerPO, paymentType);

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

		setCustomerBalanceByType(customerPO, paymentType, overBalance);
		
		PaymentPO paymentPO = new PaymentPO();
		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		
		advanceReceiptPO.setCash(paymentVO.getCash());
		advanceReceiptPO.setDes(paymentVO.getDes());
		advanceReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		advanceReceiptPO.setStatus((short) AdvanceReceiptPO.STATUS_INIT_INT);
		advanceReceiptPO.setCollectUser(new UserPO(paymentVO.getCollectUser().getUserId()));
		
		advanceReceiptDao.save(advanceReceiptPO);
		
		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));

		paymentDao.save(paymentPO);
		
		paymentVO.setPaymentId(paymentPO.getPaymentId());
		
		return 0;
	}
	
	public static void setCustomerBalance(CustomerPO customerPO, CustomerVO customerVO){
		
		if(customerPO.getAdvancePaymentPO() == null){
			customerVO.setBalance(0f);
			customerVO.setMaterialBalance(0f);
			customerVO.setProjectBalance(0f);
			customerVO.setZhenglinBalance(0f);
		}else{
			AdvancePaymentPO advancePaymentPO = customerPO.getAdvancePaymentPO();
			
			customerVO.setBalance(advancePaymentPO.getBalance());
			customerVO.setMaterialBalance(advancePaymentPO.getMaterialBalance());
			customerVO.setProjectBalance(advancePaymentPO.getProjectBalance());
			customerVO.setZhenglinBalance(advancePaymentPO.getZhenglinBalance());
		}
	}

	public static float getCustomerBalanceByType(CustomerPO customer, String type){
		float value = 0;
		
		if(type.equals(CustomerPO.BALANCE_TYPE_BALANCE_STR)){
			value = customer.getAdvancePaymentPO().getBalance();
		}else if(type.equals(CustomerPO.BALANCE_TYPE_MATERIAL_STR)){
			value = customer.getAdvancePaymentPO().getMaterialBalance();
		}else if(type.equals(CustomerPO.BALANCE_TYPE_PROJECT_STR)){
			value = customer.getAdvancePaymentPO().getProjectBalance();
		}else if(type.equals(CustomerPO.BALANCE_TYPE_ZHENGLIN_STR)){
			value = customer.getAdvancePaymentPO().getZhenglinBalance();
		}
		
		return value;
	}
	
	public static CustomerPO setCustomerBalanceByType(CustomerPO customer, String type, float value){
		
		if(type.equals(CustomerPO.BALANCE_TYPE_BALANCE_STR)){
			customer.getAdvancePaymentPO().setBalance(value);
		}else if(type.equals(CustomerPO.BALANCE_TYPE_MATERIAL_STR)){
			customer.getAdvancePaymentPO().setMaterialBalance(value);
		}else if(type.equals(CustomerPO.BALANCE_TYPE_PROJECT_STR)){
			customer.getAdvancePaymentPO().setProjectBalance(value);
		}else if(type.equals(CustomerPO.BALANCE_TYPE_ZHENGLIN_STR)){
			customer.getAdvancePaymentPO().setZhenglinBalance(value);
		}
		
		return customer;
	}
}
