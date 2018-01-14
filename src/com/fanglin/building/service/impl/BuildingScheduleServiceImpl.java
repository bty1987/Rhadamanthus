package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.dao.BuildingNodeDao;
import com.fanglin.building.dao.BuildingScheduleDao;
import com.fanglin.building.po.BuildingNodePO;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.building.po.BuildingSchedulePO;
import com.fanglin.building.service.BuildingScheduleService;
import com.fanglin.building.vo.BuildingNodeVO;
import com.fanglin.building.vo.BuildingScheduleVO;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.core.vo.Authentication;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("buildingScheduleService")
@Transactional(readOnly = true)
public class BuildingScheduleServiceImpl implements BuildingScheduleService{

	@Autowired
	private BuildingScheduleDao buildingScheduleDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private BuildingNodeDao buildingNodeDao;
	
	@Autowired
	private BuildingDao buildingDao;
	
	@Override
	public List<BuildingScheduleVO> queryBuildingScheduleByBoid(BuildingScheduleVO buildingScheduleVO) {
		
		List<BuildingSchedulePO> buildingSchedulePOs = buildingScheduleDao.queryBuildingScheduleByBoid(buildingScheduleVO.getBuilding().getBoid());
		List<BuildingScheduleVO> buildingScheduleVOs = new ArrayList<BuildingScheduleVO>();
		
		for (BuildingSchedulePO buildingSchedulePO : buildingSchedulePOs) {
			
			
			BuildingScheduleVO buildingSchedule = new BuildingScheduleVO(new BuildingNodeVO(), new BuildingVO(), new UserVO());
			
			BeanUtil.copyProperties(buildingSchedulePO, buildingSchedule, Arrays.asList("building","buildingNode", "operater"));
			
			//BeanUtil.copyProperties(buildingSchedulePO.getBuilding(), buildingSchedule.getBuilding(), Arrays.asList("houseSource", "customerSource", "houseSourceAgent", "creater", "buildingNode"));
			
			BeanUtil.copyProperties(buildingSchedulePO.getBuildingNode(), buildingSchedule.getBuildingNode());
			
			UserPO operater = userDao.queryUserByUserId(buildingSchedulePO.getOperater().getUserId());
			
			BeanUtil.copyProperties(operater, buildingSchedule.getOperater(), Arrays.asList("role", "dept", "duty"));
			
			buildingScheduleVOs.add(buildingSchedule);
		}		
		
		return buildingScheduleVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBuildingSchedule(BuildingScheduleVO buildingScheduleVO, Authentication authentication) {
		
		UserPO userPO= userDao.queryUserByUserId(authentication.getUserId());
		
		BuildingSchedulePO buildingSchedulePO = new BuildingSchedulePO();
		
		BeanUtil.copyProperties(buildingScheduleVO, buildingSchedulePO, Arrays.asList("building","buildingNode", "operater"));
		
		BuildingNodePO buildingNodePO = buildingNodeDao.get(buildingScheduleVO.getBuildingNode().getBnid());
		
		BuildingPO buildingPO = buildingDao.get(buildingScheduleVO.getBuilding().getBoid());
		
		buildingSchedulePO.setBuilding(buildingPO);
		
		buildingSchedulePO.setBuildingNode(buildingNodePO);
		
		buildingSchedulePO.setOperater(userPO);
		
		buildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingScheduleDao.save(buildingSchedulePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateBuildingSchedule(BuildingScheduleVO buildingScheduleVO) {
		
		BuildingSchedulePO buildingSchedulePO = buildingScheduleDao.get(buildingScheduleVO.getBsid());
		
		if(buildingScheduleVO.getComment() != null){
			
			buildingSchedulePO.setComment(buildingScheduleVO.getComment());
			
		}
		
		if(buildingScheduleVO.getPlanTime() != null){
			
			buildingSchedulePO.setPlanTime(buildingScheduleVO.getPlanTime());
			
		}
		
		buildingScheduleDao.update(buildingSchedulePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateBuildingScheduleForStatus(BuildingScheduleVO buildingScheduleVO) {

		BuildingSchedulePO buildingSchedulePO = buildingScheduleDao.get(buildingScheduleVO.getBsid());
		
		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_END_SHORT);
		
		return 0;
	}

}
