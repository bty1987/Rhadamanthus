package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ConstructionDrawingDao;
import com.fanglin.customer.service.ConstructionDrawingService;
import com.fanglin.customer.vo.ConstructionDrawingVO;
import com.fanglin.utils.Paging;

@Service("constructionDrawingOrderService")
@Transactional(readOnly = true)
public class ConstructionDrawingServiceImpl implements ConstructionDrawingService {

	@Autowired
	private ConstructionDrawingDao constructionDrawingDao;
	
	@Override
	public void queryCusConstructionDrawing(Paging paging, List<Filter> filters,Long cid, Short schedule) {
		
		List<ConstructionDrawingPO> constructionDrawingPOs = constructionDrawingDao.queryCusConstructionDrawing(paging, filters, cid, schedule);
		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();
		
		if(constructionDrawingPOs.size() != 0 && constructionDrawingPOs != null){
			
			for(ConstructionDrawingPO constructionDrawingPO: constructionDrawingPOs){
				
				ConstructionDrawingVO constructionDrawingVO=new ConstructionDrawingVO();
				
				constructionDrawingVO.setDrawingUrl(constructionDrawingPO.getDrawingUrl());
				constructionDrawingVO.setType(constructionDrawingPO.getType());
				
				constructionDrawingVOs.add(constructionDrawingVO);
				
			}
		}
		
		paging.setData(constructionDrawingVOs);
	}

}
