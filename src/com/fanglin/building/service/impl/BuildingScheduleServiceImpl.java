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
import com.fanglin.core.interceptor.FLException;
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
			
			BeanUtil.copyProperties(buildingSchedulePO.getBuildingNode(), buildingSchedule.getBuildingNode());
			
			UserPO operater = userDao.queryUserByUserId(buildingSchedulePO.getOperater().getUserId());
			
			BeanUtil.copyProperties(operater, buildingSchedule.getOperater(), Arrays.asList("role", "dept", "duty"));
			
			buildingScheduleVOs.add(buildingSchedule);
		}		
		
		return buildingScheduleVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int nextBuildingSchedule(BuildingScheduleVO buildingScheduleVO, Authentication authentication) {
		
		if(buildingScheduleVO.getBsid() != null){
			
			BuildingSchedulePO buildingSchedulePO = buildingScheduleDao.get(buildingScheduleVO.getBsid());
			
			if(buildingSchedulePO != null && buildingSchedulePO.getStatus() == BuildingSchedulePO.STATUS_INIT_SHORT){
				
				buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_END_SHORT);
				
				buildingScheduleDao.update(buildingSchedulePO);
			}
			
		}
		
		BuildingSchedulePO nextBuildingSchedulePO = new BuildingSchedulePO();
		
		UserPO operater = userDao.queryUserByUserId(authentication.getUserId());
		
		BuildingNodePO buildingNodePO = buildingNodeDao.queryBuildingNodeByType(buildingScheduleVO.getBuildingNode().getType(), buildingScheduleVO.getBuildingNode().getSore());
		
		BuildingPO buildingPO = buildingDao.get(buildingScheduleVO.getBuilding().getBoid());
		
		nextBuildingSchedulePO.setName(buildingNodePO.getName());
		
		nextBuildingSchedulePO.setBuilding(buildingPO);
		
		nextBuildingSchedulePO.setBuildingNode(buildingNodePO);
		
		nextBuildingSchedulePO.setOperater(operater);
		
		nextBuildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);
		
		nextBuildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingScheduleDao.save(nextBuildingSchedulePO);
		
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

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void resetBuildingSchedule(BuildingVO buildingVO, String userId) throws FLException {
		
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBoid());
		
		if(buildingPO == null){
			throw new FLException(320010, "房产单不存在");
		}
		
		if(buildingPO.getStatus() != 0){
			throw new FLException(320011, "房产单状态不可操作");
		}
		
		buildingPO.setPayType(buildingVO.getPayType());
		
		buildingDao.update(buildingPO);
		
		//修改当前房产单的房产流转
		UserPO operaterPO = userDao.queryUserByUserId(userId);
		
		buildingScheduleDao.resetBuildingSchedule(buildingVO.getBoid(), operaterPO.getUid());
		
		//生成新的房产单流转节点	
		BuildingNodePO buildingNodePO = buildingNodeDao.queryBuildingNodeByType(buildingVO.getPayType(), BuildingNodePO.COLUMN_SORE_ONE);
		
		BuildingSchedulePO buildingSchedulePO = new BuildingSchedulePO(buildingNodePO, buildingPO, operaterPO);
		
		buildingSchedulePO.setName(buildingNodePO.getName());
		
		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);
		
		buildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingScheduleDao.save(buildingSchedulePO);
		
	}
}
