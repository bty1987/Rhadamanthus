package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.payment.dao.PaymentFunctionDao;
import com.fanglin.payment.po.PaymentFunctionPO;
import com.fanglin.payment.service.PaymentFunctionService;
import com.fanglin.payment.vo.PaymentFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("paymentFunctionService")
@Transactional(readOnly = true)
public class PaymentFunctionServiceImpl implements PaymentFunctionService {
	
	@Autowired
	private PaymentFunctionDao paymentFunctionDao;

	@Override
	public List<PaymentFunctionVO> queryPaymentFunction(PaymentFunctionVO paymentFunctionVO) {
		
		List<PaymentFunctionPO> paymentFunctionPOs = paymentFunctionDao.queryPaymentFunction(paymentFunctionVO.getType());
		List<PaymentFunctionVO> paymentFunctionVOs = new ArrayList<PaymentFunctionVO>();
		
		for(PaymentFunctionPO paymentFunctionPO : paymentFunctionPOs){
			
			paymentFunctionVO = new PaymentFunctionVO();
			BeanUtil.copyPropertie(paymentFunctionPO, paymentFunctionVO);
			
			paymentFunctionVOs.add(paymentFunctionVO);
			
		}
		
		return paymentFunctionVOs;
	}

}
