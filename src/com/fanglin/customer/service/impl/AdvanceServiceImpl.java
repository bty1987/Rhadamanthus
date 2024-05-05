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
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

@Service("advanceOrderService")
@Transactional(readOnly = true)
public class AdvanceServiceImpl implements AdvanceService {

	@Autowired
	private AdvanceDao advanceDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public AdvanceVO queryCusAdvance(String orderId) {

		String platform = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		String grade = decorationPO.getGrade();
		int company = decorationPO.getCompany();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_STR", grade), company);

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_STR", company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);
		}

		if (systemConfigPO != null) platform = systemConfigPO.getValue();

		AdvancePaymentPO advancePaymentPO = advanceDao.queryCusAdvance(orderId);

		AdvanceVO advanceVO = new AdvanceVO();

		if (advancePaymentPO != null) {

			advanceVO.setBalance(advancePaymentPO.getBalance());
			advanceVO.setMaterialBalance(advancePaymentPO.getMaterialBalance());
			advanceVO.setProjectBalance(advancePaymentPO.getProjectBalance());
			advanceVO.setZhenglinBalance(advancePaymentPO.getZhenglinBalance());

			advanceVO.setPlatform(platform);
		}

		return advanceVO;
	}

}
