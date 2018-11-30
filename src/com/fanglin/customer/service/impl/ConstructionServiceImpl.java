package com.fanglin.customer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.customer.service.ConstructionService;
import com.fanglin.customer.vo.ConstructionVO;

@Service("constructionOrderService")
@Transactional(readOnly=true)
public class ConstructionServiceImpl implements ConstructionService {
	
	@Autowired
	private ConstructionDao constructionDao;

	@Override
	public ConstructionVO queryCusConstruction(String orderId) {
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);
		ConstructionVO constructionVO =new ConstructionVO();
		
		if(constructionPO != null){
			
			constructionVO.setCid(constructionPO.getCid());
			constructionVO.setCreateTime(constructionPO.getStartTime());
			constructionVO.setOrderId(orderId);
			
		}
		
		return constructionVO;
	}

}
