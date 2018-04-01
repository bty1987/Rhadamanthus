package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingDrawingDao;
import com.fanglin.building.po.BuildingDrawingPO;
import com.fanglin.building.service.BuildingDrawingService;
import com.fanglin.building.vo.BuildingDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("buildingDrawingService")
@Transactional(readOnly = true)
public class BuildingDrawingServiceImpl implements BuildingDrawingService {

	@Autowired
	private BuildingDrawingDao buildingDrawingDao;

	@Autowired
	private UserDao userDao;
	
	@Override
	public List<BuildingDrawingVO> queryBuildingDrawing(BuildingDrawingVO buildingDrawingVO) {
		
		List<BuildingDrawingPO> buildingDrawingPOs = buildingDrawingDao.queryBuildingDrawing(buildingDrawingVO.getSid(), buildingDrawingVO.getType());
		List<BuildingDrawingVO> buildingDrawingVOs = new ArrayList<BuildingDrawingVO>();
		
		for (BuildingDrawingPO buildingDrawingPO : buildingDrawingPOs) {
			
			BuildingDrawingVO buildingDrawing = new BuildingDrawingVO(new UserVO());
			
			BeanUtil.copyProperties(buildingDrawingPO, buildingDrawing, Arrays.asList("creater"));
			
			BeanUtil.copyProperties(buildingDrawingPO.getCreater(), buildingDrawing.getCreater(), Arrays.asList("role", "dept", "duty"));
			
			buildingDrawingVOs.add(buildingDrawing);
		}
		
		return buildingDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addBuildingDrawing(BuildingDrawingVO buildingDrawingVO, String userId) {
		
		UserPO createrPO = userDao.queryUserByUserId(userId);
		
		BuildingDrawingPO buildingDrawingPO = new BuildingDrawingPO(createrPO);
		
		BeanUtil.copyProperties(buildingDrawingVO, buildingDrawingPO, Arrays.asList("creater"));
		
		buildingDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		buildingDrawingPO.setStatus(BuildingDrawingPO.STATUS_INIT_SHORT);
		
		buildingDrawingDao.save(buildingDrawingPO);
		
		buildingDrawingVO.setBdid(buildingDrawingPO.getBdid());
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteBuildingDrawing(BuildingDrawingVO buildingDrawingVO) {
		
		BuildingDrawingPO buildingDrawingPO = buildingDrawingDao.get(buildingDrawingVO.getBdid());
		
		buildingDrawingPO.setStatus(BuildingDrawingPO.STATUS_DISABLE_SHORT);
		
		buildingDrawingDao.update(buildingDrawingPO);
		
	}

}
