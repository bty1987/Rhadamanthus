package com.fanglin.building.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingNodeDao;
import com.fanglin.building.po.BuildingNodePO;
import com.fanglin.building.service.BuildingNodeService;
import com.fanglin.building.vo.BuildingNodeVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("buildingNodeService")
@Transactional(readOnly = true)
public class BuildingNodeServiceImpl implements BuildingNodeService{

	@Autowired
	private BuildingNodeDao buildingNodeDao;
	
	@Override
	public void pageBuildingNode(Paging paging, List<Filter> filters) {
		
		List<BuildingNodePO> buildingNodePOs = buildingNodeDao.pageBuildingNode(paging, filters);
		List<BuildingNodeVO> buildingNodeVOs = new ArrayList<BuildingNodeVO>();
		
		if(buildingNodePOs != null){
			
			for (BuildingNodePO buildingNodePO : buildingNodePOs) {
				
				BuildingNodeVO buildingNodeVO = new BuildingNodeVO();
				BeanUtil.copyProperties(buildingNodePO, buildingNodeVO);
				
				buildingNodeVOs.add(buildingNodeVO);
			}
		}
		
		paging.setData(buildingNodeVOs);
	}

	@Override
	public List<BuildingNodeVO> queryBuildingNodeByType(BuildingNodeVO buildingNodeVO) {
		
		List<BuildingNodePO> buildingNodePOs = buildingNodeDao.queryBuildingNodeByType(buildingNodeVO.getType(), buildingNodeVO.getSore());
		List<BuildingNodeVO> buildingNodeVOs = new ArrayList<BuildingNodeVO>();
		
		for (BuildingNodePO buildingNodePO : buildingNodePOs) {
			
			BuildingNodeVO buildingNode =  new BuildingNodeVO();
			
			BeanUtil.copyProperties(buildingNodePO, buildingNode);
			
			buildingNodeVOs.add(buildingNode);
			
		}
		
		return buildingNodeVOs;
	}

	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addBuildingNode(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = new BuildingNodePO();
		
		buildingNodePO.setName(buildingNodeVO.getName());
		buildingNodePO.setType(buildingNodeVO.getType());
		
		buildingNodeDao.save(buildingNodePO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBuildingNode(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = buildingNodeDao.get(buildingNodeVO.getBnid());
		
		buildingNodePO.setName(buildingNodeVO.getName());
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBuildingNodeForStatus(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = buildingNodeDao.get(buildingNodeVO.getBnid());
		
		buildingNodePO.setStatus(buildingNodeVO.getStatus());
		
		buildingNodeDao.update(buildingNodePO);
		
	}


	
	
}
