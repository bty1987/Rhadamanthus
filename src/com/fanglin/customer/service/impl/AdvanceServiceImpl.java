package com.fanglin.customer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.AdvanceDao;
import com.fanglin.customer.service.AdvanceService;
import com.fanglin.customer.vo.AdvanceVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.po.AdvancePaymentPO;

@Service("advanceOrderService")
@Transactional(readOnly = true)
public class AdvanceServiceImpl implements AdvanceService {
	
	@Autowired
	private AdvanceDao advanceDao;
	
	@Autowired
	private DecorationDao decorationDao;

	@Override
	public AdvanceVO queryCusAdvance(AdvanceVO advanceVO,String orderId) {
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO != null){
			
			AdvancePaymentPO advancePaymentPO= advanceDao.queryCusAdvance(advanceVO.getCustomerId(),decorationPO.getCompany());
			
			advanceVO= new AdvanceVO();
			
			if(advancePaymentPO != null){
				
				advanceVO.setBalance(advancePaymentPO.getBalance());
				advanceVO.setMaterialBalance(advancePaymentPO.getMaterialBalance());
				advanceVO.setProjectBalance(advancePaymentPO.getProjectBalance());
				advanceVO.setZhenglinBalance(advancePaymentPO.getZhenglinBalance());
				
			}
		}
		
		return advanceVO;
	}

}
