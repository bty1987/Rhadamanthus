package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ServicePaymentDao;
import com.fanglin.customer.service.ServicePaymentService;
import com.fanglin.customer.vo.ServicePaymentVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Paging;

@Service("servicePaymentOrderService")
@Transactional(readOnly = true)
public class ServicePaymentServiceImpl implements ServicePaymentService {

	@Autowired
	private ServicePaymentDao servicePaymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void queryCusServicePayment(Paging paging, List<Filter> filters, ServicePaymentVO servicePaymentVO) {

		String orderId = servicePaymentVO.getOrderId();
		String platform = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		String grade = decorationPO.getGrade();
		int company = decorationPO.getCompany();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_%s_STR", PaytranPO.ATTTYPE_DECORATION_INT, grade), company);

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_STR", grade), company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_STR", company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);
		}

		if (systemConfigPO != null) platform = systemConfigPO.getValue();

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.queryCusServicePayment(paging, filters, servicePaymentVO.getOrderId());
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		if (servicePaymentPOs.size() != 0 && servicePaymentPOs != null) {

			for (ServicePaymentPO servicePaymentPO : servicePaymentPOs) {

				servicePaymentVO = new ServicePaymentVO();

				servicePaymentVO.setSpid(servicePaymentPO.getSpid());
				servicePaymentVO.setOrderId(servicePaymentPO.getDecoration().getOrderId());
				servicePaymentVO.setAdvanceMoney(servicePaymentPO.getAdvanceMoney());
				servicePaymentVO.setServiceMoney(servicePaymentPO.getServiceMoney());
				servicePaymentVO.setStatus(servicePaymentPO.getStatus());
				servicePaymentVO.setType(servicePaymentPO.getType());

				if (servicePaymentPO.getServiceReceipt() != null) {
					servicePaymentVO.setCollectTime(servicePaymentPO.getServiceReceipt().getCollectTime());
				}

				servicePaymentVO.setPlatform(platform);

				servicePaymentVOs.add(servicePaymentVO);
			}
		}

		paging.setData(servicePaymentVOs);
	}

	@Override
	public long amountCusServicePayment(ServicePaymentVO servicePaymentVO) {

		long _realMoney = servicePaymentDao.amountCusServicePayment(servicePaymentVO.getOrderId());

		return _realMoney;
	}

}
