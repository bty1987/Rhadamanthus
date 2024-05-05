package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PaymentDao;
import com.fanglin.customer.service.PaymentService;
import com.fanglin.customer.vo.PaymentVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Paging;

@Service("paymentOrderService")
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void queryCusPayment(Paging paging, List<Filter> filters, PaymentVO paymentVO) {

		String orderId = paymentVO.getOrderId();
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

		List<PaymentPO> paymentPOs = paymentDao.queryCusPayment(paging, filters, paymentVO.getOrderId());
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		if (paymentPOs == null || paymentPOs.size() == 0) return;

		for (PaymentPO paymentPO : paymentPOs) {

			paymentVO = new PaymentVO();

			paymentVO.setOrderId(paymentPO.getOrderId());
			paymentVO.setPaymentType(paymentPO.getPaymentType());
			paymentVO.setMoney(paymentPO.getRecharge());
			paymentVO.setType(paymentPO.getType());
			paymentVO.setCollectTime(paymentPO.getCreateTime());

			paymentVO.setPlatform(platform);

			paymentVOs.add(paymentVO);
		}

		paging.setData(paymentVOs);
	}

	@Override
	public Integer queryCusPaymentConfig(String orderId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return 0;

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("APPLET_PAYMENT_CONFIG", decorationPO.getCompany());

		if (systemConfigPO != null) return Integer.valueOf(systemConfigPO.getValue());

		return null;
	}

	@Override
	public String queryCusPaymentPlatform(String orderId, Integer atttype) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return "";

		String grade = decorationPO.getGrade();
		int company = decorationPO.getCompany();

		SystemConfigPO systemConfigPO = null;

		if (atttype != null) {
			systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_%s_STR", atttype, grade), company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_STR", grade), company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_STR", company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);
		}

		if (systemConfigPO != null) return systemConfigPO.getValue();

		return "";
	}

}
