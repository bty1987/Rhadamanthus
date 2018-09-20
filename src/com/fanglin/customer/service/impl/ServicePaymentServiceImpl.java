package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.dao.ServicePaymentDao;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.ServicePaymentService;
import com.fanglin.customer.vo.ServicePaymentVO;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

@Service("servicePaymentOrderService")
@Transactional(readOnly=true)
public class ServicePaymentServiceImpl implements ServicePaymentService {
	
	@Autowired
	private ServicePaymentDao servicePaymentDao;
	
	@Autowired
	private DecorationDao decorationOrderDao;

	@Override
	public void queryCusServicePayment(Paging paging, List<Filter> filters, ServicePaymentVO servicePaymentVO,String unionId) {
		
		DecorationPO decorationPO = decorationOrderDao.queryCusDecorationByOrderId(servicePaymentVO.getOrderId(), unionId);
		
		if(decorationPO != null){
			
			List<ServicePaymentPO> servicePaymentPOs = servicePaymentDao.queryCusServicePayment(paging, filters, servicePaymentVO.getOrderId());
			List<ServicePaymentVO> servicePaymentVOs = new ArrayList<ServicePaymentVO>();
			
			for(ServicePaymentPO servicePaymentPO : servicePaymentPOs){
				
				servicePaymentVO = new ServicePaymentVO();
				
				servicePaymentVO.setOrderId(servicePaymentPO.getDecoration().getOrderId());
				servicePaymentVO.setAdvanceMoney(servicePaymentPO.getAdvanceMoney());
				servicePaymentVO.setCollectTime(servicePaymentPO.getServiceReceipt().getCollectTime());
				servicePaymentVO.setServiceMoney(servicePaymentPO.getServiceMoney());
				servicePaymentVO.setStatus(servicePaymentPO.getStatus());
				servicePaymentVO.setType(servicePaymentPO.getType());
				
				servicePaymentVOs.add(servicePaymentVO);
				
			}
			
			paging.setData(servicePaymentVOs);
		}
	}

}
