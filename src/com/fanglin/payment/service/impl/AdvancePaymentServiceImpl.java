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

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
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
	private DecorationDao decorationDao;
	
	@Override
	public List<Float> queryAdvancePaymentByCustomerId(CustomerVO customerVO, int company) {
		
		List<Float> advances = new ArrayList<Float>();
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerVO.getCid(),company);
		
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
	public List<Float> queryAdvancePaymentByOrderId(DecorationVO decorationVO) throws FLException {
		
		List<Float> advances = new ArrayList<Float>();	
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(decorationPO.getCustomer().getCid(),decorationPO.getCompany());
		
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
	public int updateAdvancePayment(PaymentVO paymentVO, int company) throws FLException {
		
		float recharge = 0;
		
		CustomerPO customerPO = customerDao.get(paymentVO.getCustomer().getCid());
		
		if(customerPO == null){
			throw new FLException(230001, "客户信息不存在");
		}
		
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCid(), company);
		
		if(advancePaymentPO == null){
			
			advancePaymentPO = new AdvancePaymentPO();
			
			advancePaymentPO.setCustomer(customerPO);
			
			advancePaymentDao.save(advancePaymentPO);
		}
		
		//计算recharge操作金额
		recharge = PaymentServiceImpl.gatherPayment(paymentVO);
		
		float balance = 0;
		Short type = paymentVO.getType();
		Short paymentType = paymentVO.getPaymentType();
		
		//计算当前款项类型的预付款的余额
		balance = getCustomerBalanceByType(advancePaymentPO, paymentType);
		
		//收款(余额加上操作金额),付款(预付款余额减去操作的金额)之后得到的余额
		float overBalance = 0;
		if(type == PaymentPO.PAYMENT_TYPE_COLLECTION_INT){
			overBalance = Arith.add(balance, recharge);
		} else {
			if(balance < recharge){
				throw new FLException(130001, "当前客户预付款月不足");
			}
			overBalance = Arith.sub(balance, recharge);
		}
		
		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		
		//设置当前款项类型的预付款(advancePayment)的余额
		setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);
		
		PaymentPO paymentPO = new PaymentPO();
		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		
		advanceReceiptPO.setCash(paymentVO.getCash());
		advanceReceiptPO.setComment(paymentVO.getComment());
		advanceReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_INIT_INT);
		UserPO userPO = userDao.queryUserByUserId(paymentVO.getCollectUser().getUserId());
		advanceReceiptPO.setCollecter(userPO);
		advanceReceiptPO.setCollecterName(userPO.getUserName());
		advanceReceiptPO.setConfirmerName("");
		
		advanceReceiptDao.save(advanceReceiptPO);
		
		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setCompany(company);
		paymentPO.setCreater(userPO);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser"));
		
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		paymentDao.save(paymentPO);
		
		paymentVO.setPid(paymentPO.getPid());
		
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

	//计算当前款项类型的预付款的余额
	public static float getCustomerBalanceByType(AdvancePaymentPO advancePaymentPO, Short type){
		float value = 0;
		
		if(type == CustomerPO.BALANCE_TYPE_BALANCE_INT){
			value = advancePaymentPO.getBalance();
		}else if(type == CustomerPO.BALANCE_TYPE_MATERIAL_INT){
			value = advancePaymentPO.getMaterialBalance();
		}else if(type == CustomerPO.BALANCE_TYPE_PROJECT_INT){
			value = advancePaymentPO.getProjectBalance();
		}else if(type == CustomerPO.BALANCE_TYPE_ZHENGLIN_INT){
			value = advancePaymentPO.getZhenglinBalance();
		}
		
		return value;
	}
	
	//设置当前款项类型的预付款(advancePayment)的余额
	public static void setCustomerBalanceByType(AdvancePaymentPO advancePaymentPO, Short type, float value){
		
		if(type == CustomerPO.BALANCE_TYPE_BALANCE_INT){
			advancePaymentPO.setBalance(value);
		}else if(type == CustomerPO.BALANCE_TYPE_MATERIAL_INT){
			advancePaymentPO.setMaterialBalance(value);
		}else if(type == CustomerPO.BALANCE_TYPE_PROJECT_INT){
			advancePaymentPO.setProjectBalance(value);
		}else if(type == CustomerPO.BALANCE_TYPE_ZHENGLIN_INT){
			advancePaymentPO.setZhenglinBalance(value);
		}
	}

}
