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
import com.fanglin.core.vo.Authentication;
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
			
			UserPO userPO = userDao.queryUserByUserId(buildingDrawingPO.getCreater().getUserId());
			
			BeanUtil.copyProperties(userPO, buildingDrawing.getCreater(), Arrays.asList("role", "dept", "duty"));
			
			buildingDrawingVOs.add(buildingDrawing);
		}
		
		return buildingDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBuildingDrawing(BuildingDrawingVO buildingDrawingVO,  Authentication authentication) {
		
		BuildingDrawingPO buildingDrawingPO = new BuildingDrawingPO();
		BeanUtil.copyProperties(buildingDrawingVO, buildingDrawingPO, Arrays.asList("creater"));
		
		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
	
		buildingDrawingPO.setCreater(userPO);
		
		buildingDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		buildingDrawingPO.setStatus(BuildingDrawingPO.STATUS_INIT_INT);
		
		buildingDrawingDao.save(buildingDrawingPO);
		
		buildingDrawingVO.setBdid(buildingDrawingPO.getBdid());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteBuildingDrawing(BuildingDrawingVO buildingDrawingVO) {
		
		BuildingDrawingPO buildingDrawingPO = buildingDrawingDao.get(buildingDrawingVO.getBdid());
		
		if(buildingDrawingPO.getStatus() == BuildingDrawingPO.STATUS_INIT_INT){
			buildingDrawingPO.setStatus(BuildingDrawingPO.STATUS_DISABLE_INT);
		}else if(buildingDrawingPO.getStatus() == BuildingDrawingPO.STATUS_DISABLE_INT){
			buildingDrawingPO.setStatus(BuildingDrawingPO.STATUS_INIT_INT);
		}
		
		buildingDrawingDao.update(buildingDrawingPO);
		
		return 0;
	}

}
