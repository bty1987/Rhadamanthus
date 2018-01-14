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
	public BuildingNodeVO queryBuildingNodeByType(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = buildingNodeDao.queryBuildingNodeByType(buildingNodeVO.getType(), buildingNodeVO.getSore());
		
		BuildingNodeVO buildingNode =  new BuildingNodeVO();
		
		BeanUtil.copyProperties(buildingNodePO, buildingNode);
		
		
		return buildingNode;
	}

	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBuildingNode(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = new BuildingNodePO();
		
		buildingNodePO.setName(buildingNodeVO.getName());
		buildingNodePO.setType(buildingNodeVO.getType());
		
		buildingNodeDao.save(buildingNodePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateBuildingNode(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = buildingNodeDao.get(buildingNodeVO.getBnid());
		
		buildingNodePO.setName(buildingNodeVO.getName());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBuildingNodeForStatus(BuildingNodeVO buildingNodeVO) {
		
		BuildingNodePO buildingNodePO = buildingNodeDao.get(buildingNodeVO.getBnid());
		
		buildingNodePO.setStatus(buildingNodeVO.getStatus());
		
		buildingNodeDao.update(buildingNodePO);
		
	}


	
	
}
