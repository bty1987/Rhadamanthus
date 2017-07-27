package com.fanglin.data.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.construction.dao.ConstructionNodeDao;
import com.fanglin.data.construction.service.ConstructionNodeService;
import com.fanglin.data.construction.vo.ConstructionNodeCompanyVO;
import com.fanglin.data.construction.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodeCompanyPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionNodeService")
@Transactional(readOnly=true)
public class ConstructionNodeServiceImpl implements ConstructionNodeService{

	@Autowired
	private ConstructionNodeDao constructionNodeDao;
	
	@Override
	public void pageConstructionNode(Paging paging, List<Filter> filters) {
		
		List<ConstructionNodePO> constructionNodePOs =  constructionNodeDao.pageConstructionNode(paging, filters);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();
		
		if(constructionNodePOs != null){
			for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
				ConstructionNodeVO constructionNodeVO = new ConstructionNodeVO();
				BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);
				constructionNodeVOs.add(constructionNodeVO);
			}
		}
		
		paging.setData(constructionNodeVOs);

	}

	@Override
	public List<ConstructionNodeVO> queryConstructionNode(ConstructionNodeVO constructionNode) {
		
		List<ConstructionNodePO> constructionNodePOs;
		
		if(constructionNode == null){
			constructionNodePOs = constructionNodeDao.queryConstructionNode(null);
		}else{
			constructionNodePOs = constructionNodeDao.queryConstructionNode(constructionNode.getStatus());
		}
		
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();
		
		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			ConstructionNodeVO constructionNodeVO  = new ConstructionNodeVO();
			BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);
			constructionNodeVOs.add(constructionNodeVO);
		}
		
		return constructionNodeVOs;
	}
	
	@Override
	public List<ConstructionNodeVO> queryConstructionNodeByCid(ConstructionNodeCompanyVO constructionNodeCompanyVO) {
		
		List<ConstructionNodeCompanyPO> constructionNodeCompanyPOs  = constructionNodeDao.queryConstructionNodeCompanyByCid(constructionNodeCompanyVO.getCid());
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();
		
		for (ConstructionNodeCompanyPO constructionNodeCompanyPO : constructionNodeCompanyPOs) {
			ConstructionNodePO constructionNodePO= constructionNodeCompanyPO.getConstructionNode();
			ConstructionNodeVO constructionNodeVO  = new ConstructionNodeVO();
			BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);
			constructionNodeVOs.add(constructionNodeVO);
		}
		
		return constructionNodeVOs;
	}

}
