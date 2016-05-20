/**
 * @File Name		: BuildingNameRuleServiceImpl.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.BuildingNameRuleDao;
import com.fanglin.common.po.BuildingNameRulePO;
import com.fanglin.common.service.BuildingNameRuleService;
import com.fanglin.common.vo.BuildingNameRuleVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("buildingNameRuleService")
@Transactional(readOnly=true)
public class BuildingNameRuleServiceImpl implements BuildingNameRuleService {
	
	@Autowired
	private BuildingNameRuleDao buildingNameRuleDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateBuildNameRule(BuildingNameRuleVO buildingNameRuleVO){
		
		BuildingNameRulePO buildingNameRulePO = new BuildingNameRulePO();
		BeanUtil.copyProperties(buildingNameRuleVO, buildingNameRulePO);
		buildingNameRuleDao.save(buildingNameRulePO);
	}

	@Override
	public void queryBuildNameRulePage(Paging paging, List<FilterVO> filters){

		List<BuildingNameRulePO> buildingNameRulePOs = buildingNameRuleDao.queryPageBuildingNameRule(paging, filters);
		List<BuildingNameRuleVO> buildingNameRuleVOs = new ArrayList<BuildingNameRuleVO>();
		
		for(BuildingNameRulePO buildingNameRulePO: buildingNameRulePOs){
			BuildingNameRuleVO buildingNameRuleVO = new BuildingNameRuleVO();
			BeanUtil.copyProperties(buildingNameRulePO, buildingNameRuleVO);
			
			buildingNameRuleVOs.add(buildingNameRuleVO);
		}
		
		paging.setData(buildingNameRuleVOs);
	}

	@Override
	public List<BuildingNameRuleVO> queryBuildNameRule(){
		
		List<BuildingNameRulePO> buildingNameRulePOs = buildingNameRuleDao.list();
		List<BuildingNameRuleVO> buildingNameRuleVOs = new ArrayList<BuildingNameRuleVO>();
		
		for(BuildingNameRulePO buildingNameRulePO: buildingNameRulePOs){
			BuildingNameRuleVO buildingNameRuleVO = new BuildingNameRuleVO();
			BeanUtil.copyProperties(buildingNameRulePO, buildingNameRuleVO);
			buildingNameRuleVOs.add(buildingNameRuleVO);
		}
		
		return buildingNameRuleVOs;
	}

	@Override
	public BuildingNameRuleVO queryBuildingNameRuleById(int id){
		
		BuildingNameRulePO buildingNameRulePO = buildingNameRuleDao.get(id);
		BuildingNameRuleVO buildingNameRuleVO = new BuildingNameRuleVO();
		
		BeanUtil.copyProperties(buildingNameRulePO, buildingNameRuleVO);
		
		return buildingNameRuleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteBuildingNameRule(BuildingNameRuleVO buildingNameRuleVO){
		
		BuildingNameRulePO buildingNameRulePO = buildingNameRuleDao.get(buildingNameRuleVO.getId()) ;
		buildingNameRuleDao.delete(buildingNameRulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteBuildNameRuleById(int id){
		buildingNameRuleDao.deleteById(id);
	}

}
