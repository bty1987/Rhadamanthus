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
	public AdvanceVO queryCusAdvance(String orderId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		AdvancePaymentPO advancePaymentPO = advanceDao.queryCusAdvance(orderId);

		AdvanceVO advanceVO = new AdvanceVO();

		if (advancePaymentPO != null) {

			advanceVO.setBalance(advancePaymentPO.getBalance());
			advanceVO.setMaterialBalance(advancePaymentPO.getMaterialBalance());
			advanceVO.setProjectBalance(advancePaymentPO.getProjectBalance());
			advanceVO.setZhenglinBalance(advancePaymentPO.getZhenglinBalance());
		}

		if (decorationPO.getCompany() != 2) advanceVO.setOrderId(orderId);

		return advanceVO;
	}

}
