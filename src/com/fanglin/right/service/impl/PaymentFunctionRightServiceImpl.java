package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.payment.dao.PaymentFunctionDao;
import com.fanglin.payment.po.PaymentFunctionPO;
import com.fanglin.payment.vo.PaymentFunctionVO;
import com.fanglin.right.dao.PaymentFunctionRightDao;
import com.fanglin.right.po.PaymentFunctionRightPO;
import com.fanglin.right.service.PaymentFunctionRightService;
import com.fanglin.right.vo.PaymentFunctionRightVO;
import com.fanglin.utils.BeanUtil;

@Service("paymentFunctionRightService")
@Transactional(readOnly = true)
public class PaymentFunctionRightServiceImpl implements PaymentFunctionRightService {

	@Autowired
	private PaymentFunctionRightDao paymentFunctionRightDao;
	
	@Autowired
	private PaymentFunctionDao paymentFunctionDao;
	
	@Override
	public List<PaymentFunctionRightVO> queryPaymentFunctionRight(PaymentFunctionRightVO paymentFunctionRightVO) {
		
		List<PaymentFunctionRightPO> paymentFunctionRightPOs = paymentFunctionRightDao.queryPaymentFunctionRight(paymentFunctionRightVO.getName(), paymentFunctionRightVO.getType());
		List<PaymentFunctionRightVO> paymentFunctionRightVOs = new ArrayList<PaymentFunctionRightVO>();
		
		for(PaymentFunctionRightPO paymentFunctionRightPO : paymentFunctionRightPOs){
			
			paymentFunctionRightVO = new PaymentFunctionRightVO(new PaymentFunctionVO());
			
			BeanUtil.copyPropertie(paymentFunctionRightPO, paymentFunctionRightVO, Arrays.asList("paymentFunction"));
			BeanUtil.copyPropertie(paymentFunctionRightPO.getPaymentFunction(), paymentFunctionRightVO.getPaymentFunction());
			
			paymentFunctionRightVOs.add(paymentFunctionRightVO);
		}
		
		return paymentFunctionRightVOs;
	}

	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaymentFunctionRight(PaymentFunctionRightVO paymentFunctionRightVO, List<Long> pfids, int company) {
		
		paymentFunctionRightDao.deletePaymentFunctionRightByName(paymentFunctionRightVO.getName(), paymentFunctionRightVO.getType());
		
		for (Long pfid : pfids) {
			PaymentFunctionRightPO paymentFunctionRightPO = new PaymentFunctionRightPO();
			PaymentFunctionPO paymentFunctionPO = paymentFunctionDao.get(pfid);
			
			paymentFunctionRightPO.setName(paymentFunctionRightVO.getName());
			paymentFunctionRightPO.setPaymentFunction(paymentFunctionPO);
			paymentFunctionRightPO.setType(paymentFunctionRightVO.getType());
			paymentFunctionRightPO.setCompany(company);
			
			paymentFunctionRightDao.save(paymentFunctionRightPO);
		}
		
	}

}
