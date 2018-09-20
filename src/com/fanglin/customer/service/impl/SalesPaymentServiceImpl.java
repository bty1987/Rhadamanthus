package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.dao.SalesPaymentDao;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.SalesPaymentService;
import com.fanglin.customer.vo.SalesPaymentVO;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.utils.Paging;

@Service("salesPaymentOrderService")
@Transactional(readOnly=true)
public class SalesPaymentServiceImpl implements SalesPaymentService {
	
	@Autowired
	private SalesPaymentDao salesPaymentDao;
	
	@Autowired
	private DecorationDao decorationOrderDao;

	@Override
	public void queryCusSalesPayment(Paging paging, List<Filter> filters,SalesPaymentVO salesPaymentVO,String unionId) {
		
		DecorationPO decorationPO = decorationOrderDao.queryCusDecorationByOrderId(salesPaymentVO.getOrderId(), unionId);
		
		if(decorationPO != null){
			
			List<SalesPaymentPO> salesPaymentPOs=salesPaymentDao.queryCusSalesPayment(paging, filters, salesPaymentVO.getOrderId());
	        List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();
	        
			for(SalesPaymentPO salesPaymentPO : salesPaymentPOs){
				
				salesPaymentVO = new SalesPaymentVO();
				
				salesPaymentVO.setOrderId(salesPaymentPO.getSales().getOrderId());
				salesPaymentVO.setMoney(salesPaymentPO.getReferMoney());
				salesPaymentVO.setType(salesPaymentPO.getType());
				salesPaymentVO.setPaymentType(salesPaymentPO.getType());
				salesPaymentVO.setBrand(salesPaymentPO.getBrand());
				salesPaymentVO.setCollectTime(salesPaymentPO.getSalesReceipt().getCollectTime());
				
				salesPaymentVOs.add(salesPaymentVO);
			}
			
			paging.setData(salesPaymentVOs);
		}
	}

}
