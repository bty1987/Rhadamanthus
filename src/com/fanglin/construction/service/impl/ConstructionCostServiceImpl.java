package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionCostDao;
import com.fanglin.construction.po.ConstructionCostPO;
import com.fanglin.construction.service.ConstructionCostService;
import com.fanglin.construction.vo.ConstructionCostVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionCostService")
@Transactional(readOnly = true)
public class ConstructionCostServiceImpl implements ConstructionCostService{
	
	@Autowired
	private ConstructionCostDao constructionCostDao;
	
	@Override
	public void pageConstructionCost(Paging paging, List<Filter> filters, int company) {
		
		List<ConstructionCostPO> constructionCostPOs = constructionCostDao.pageConstructionCost(paging, filters, company);
		List<ConstructionCostVO> constructionCostVOs = new ArrayList<ConstructionCostVO>();
		
		ConstructionCostVO constructionCostVO;
		
		if(constructionCostPOs != null){
			for (ConstructionCostPO constructionCostPO : constructionCostPOs) {
				constructionCostVO = new ConstructionCostVO();
				
				BeanUtil.copyProperties(constructionCostPO, constructionCostVO);
				
				constructionCostVOs.add(constructionCostVO);
			}
		}
		
		paging.setData(constructionCostVOs);
		
	}

	@Override
	public List<ConstructionCostVO> queryConstructionCost(int company) {
		
		List<ConstructionCostPO> constructionCostPOs = constructionCostDao.queryConstructionCost(company);
		List<ConstructionCostVO> constructionCostVOs = new ArrayList<ConstructionCostVO>();
		
		ConstructionCostVO constructionCostVO;
		
		for (ConstructionCostPO constructionCostPO : constructionCostPOs) {
			constructionCostVO = new ConstructionCostVO();
				
			BeanUtil.copyProperties(constructionCostPO, constructionCostVO);
				
			constructionCostVOs.add(constructionCostVO);
			
		  }
		
		return constructionCostVOs;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionCost(ConstructionCostVO constructionCostVO, int company) {
		
		ConstructionCostPO constructionCostPO = new ConstructionCostPO();
		
		BeanUtil.copyProperties(constructionCostVO, constructionCostPO);
		
		constructionCostPO.setCompany(company);
		
		constructionCostDao.save(constructionCostPO);
		
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionCost(ConstructionCostVO constructionCostVO) throws FLException {
		
		ConstructionCostPO constructionCostPO = constructionCostDao.get(constructionCostVO.getCcid());
		
		if(constructionCostPO == null) {
			throw new FLException(120029, "工程成本不存在");
		}
		
		constructionCostPO.setName(constructionCostVO.getName());
		
		constructionCostPO.setAreaLeft(constructionCostVO.getAreaLeft());
		
		constructionCostPO.setAreaRight(constructionCostVO.getAreaRight());
		
		constructionCostPO.setAccessory(constructionCostVO.getAccessory());
		
		constructionCostPO.setSalary(constructionCostVO.getSalary());
		
		constructionCostDao.update(constructionCostPO);
		
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionCostForStatus(ConstructionCostVO constructionCostVO) {
		
		ConstructionCostPO constructionCostPO = constructionCostDao.get(constructionCostVO.getCcid());
		
		constructionCostPO.setStatus(constructionCostVO.getStatus());
		
		constructionCostDao.update(constructionCostPO);
		
	}


}
