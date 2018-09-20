package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.dao.MaterialPaymentDao;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.MaterialPaymentService;
import com.fanglin.customer.vo.MaterialPaymentVO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.utils.Paging;

@Service("materialPaymentOrderService")
@Transactional(readOnly=true)
public class MaterialPaymentServiceImpl implements MaterialPaymentService {

	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private DecorationDao decorationOrderDao;
	
	@Override
	public void queryCusMaterialPayment(Paging paging, List<Filter> filters, MaterialPaymentVO materialPaymentVO,String unionId) {
		
		DecorationPO decorationPO = decorationOrderDao.queryCusDecorationByOrderId(materialPaymentVO.getOrderId(), unionId);
		
		if(decorationPO != null){
			
			List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryCusMaterialByOrderId(paging, filters, materialPaymentVO.getOrderId());
			List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
			
			for(MaterialPaymentPO materialPaymentPO : materialPaymentPOs){
				
				materialPaymentVO = new MaterialPaymentVO();
				
				materialPaymentVO.setOrderId(materialPaymentPO.getMaterial().getOrderId());
				materialPaymentVO.setPaymentType(materialPaymentPO.getPaymentType());
				materialPaymentVO.setPaymentStatus(materialPaymentPO.getPaymentStatus());
				materialPaymentVO.setBrand(materialPaymentPO.getMaterial().getBrand());
				materialPaymentVO.setReferMoney(materialPaymentPO.getReferMoney());
				
				if(materialPaymentPO.getMaterialReceipt() != null){
					materialPaymentVO.setCollectTime(materialPaymentPO.getMaterialReceipt().getCollectTime());
				}
				
				
				materialPaymentVOs.add(materialPaymentVO);
			}
			
			paging.setData(materialPaymentVOs);
			
		}
	}

}
