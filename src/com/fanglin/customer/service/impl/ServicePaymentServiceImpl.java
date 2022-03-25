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
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

@Service("servicePaymentOrderService")
@Transactional(readOnly = true)
public class ServicePaymentServiceImpl implements ServicePaymentService {

	@Autowired
	private ServicePaymentDao servicePaymentDao;

	@Override
	public void queryCusServicePayment(Paging paging, List<Filter> filters, ServicePaymentVO servicePaymentVO) {

		List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.queryCusServicePayment(paging, filters, servicePaymentVO.getOrderId());
		List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();

		if (servicePaymentPOs.size() != 0 && servicePaymentPOs != null) {

			for (ServicePaymentPO servicePaymentPO : servicePaymentPOs) {

				servicePaymentVO = new ServicePaymentVO();

				servicePaymentVO.setOrderId(servicePaymentPO.getDecoration().getOrderId());
				servicePaymentVO.setAdvanceMoney(servicePaymentPO.getAdvanceMoney());
				servicePaymentVO.setServiceMoney(servicePaymentPO.getServiceMoney());
				servicePaymentVO.setStatus(servicePaymentPO.getStatus());
				servicePaymentVO.setType(servicePaymentPO.getType());

				if (servicePaymentPO.getServiceReceipt() != null) {
					servicePaymentVO.setCollectTime(servicePaymentPO.getServiceReceipt().getCollectTime());
				}

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
