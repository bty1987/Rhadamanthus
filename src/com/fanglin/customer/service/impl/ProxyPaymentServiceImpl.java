package com.fanglin.customer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ProxyPaymentService;
import com.fanglin.customer.vo.ProxyPaymentVO;
import com.fanglin.payment.dao.ProxyPaymentDao;
import com.fanglin.payment.po.ProxyPaymentPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("cusProxyPaymentService")
@Transactional(readOnly = true)
public class ProxyPaymentServiceImpl implements ProxyPaymentService {

	@Autowired
	private ProxyPaymentDao proxyPaymentDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public ProxyPaymentVO queryCusProxyPayment(ProxyPaymentVO proxyPaymentVO) throws FLException {

		ProxyPaymentPO proxyPaymentPO = proxyPaymentDao.get(proxyPaymentVO.getPpid());

		if (proxyPaymentPO == null) return proxyPaymentVO;

		String platform = "";

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_B_STR", proxyPaymentPO.getCompany());

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_STR", proxyPaymentPO.getCompany());
		}

		if (systemConfigPO != null) platform = systemConfigPO.getValue();

		BeanUtil.copyProperties(proxyPaymentPO, proxyPaymentVO);

		proxyPaymentVO.setPlatform(platform);

		return proxyPaymentVO;
	}

}
