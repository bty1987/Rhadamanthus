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
	public List<BuildingScheduleVO> queryBuildingScheduleByBid(BuildingScheduleVO buildingScheduleVO) {
		
		List<BuildingSchedulePO> buildingSchedulePOs = buildingScheduleDao.queryBuildingScheduleByBid(buildingScheduleVO.getBuilding().getBid());
		List<BuildingScheduleVO> buildingScheduleVOs = new ArrayList<BuildingScheduleVO>();
		
		for (BuildingSchedulePO buildingSchedulePO : buildingSchedulePOs) {
			
			BuildingScheduleVO buildingSchedule = buildingSchedulePOToVO(buildingSchedulePO);
			
			buildingScheduleVOs.add(buildingSchedule);
			
		}		
		
		return buildingScheduleVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public BuildingScheduleVO nextBuildingSchedule(BuildingScheduleVO buildingScheduleVO, String userId) {
		
		BuildingSchedulePO buildingSchedulePO = null;
		
		if(buildingScheduleVO.getBsid() != null){
			
			buildingSchedulePO = buildingScheduleDao.get(buildingScheduleVO.getBsid());
			
			if(buildingSchedulePO != null && buildingSchedulePO.getStatus() == BuildingSchedulePO.STATUS_INIT_SHORT){
				
				buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_END_SHORT);
				
				buildingSchedulePO.setPlanTime(buildingScheduleVO.getPlanTime());
				
				buildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
				
				buildingSchedulePO.setComment(buildingScheduleVO.getComment());
				
				buildingScheduleDao.update(buildingSchedulePO);
			}
			
		}
		
		BuildingSchedulePO nextBuildingSchedulePO = new BuildingSchedulePO();
		
		UserPO operater = userDao.queryUserByUserId(userId);
		
		List<BuildingNodePO> buildingNodePOs = buildingNodeDao.queryBuildingNodeByType(buildingSchedulePO.getBuildingNode().getType(), buildingScheduleVO.getBuildingNode().getSore(), BuildingNodePO.STATUS_ENABLE_SHORT);
		
		BuildingNodePO buildingNodePO = buildingNodePOs.get(0);
		
		nextBuildingSchedulePO.setName(buildingNodePO.getName());
		
		nextBuildingSchedulePO.setBuilding(buildingSchedulePO.getBuilding());
		
		nextBuildingSchedulePO.setBuildingNode(buildingNodePO);
		
		nextBuildingSchedulePO.setOperater(operater);
		
		nextBuildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);
		
		buildingScheduleDao.save(nextBuildingSchedulePO);
		
		BuildingScheduleVO nextBuildingScheduleVO = buildingSchedulePOToVO(nextBuildingSchedulePO);
		
		return nextBuildingScheduleVO;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public BuildingScheduleVO updateBuildingSchedule(BuildingScheduleVO buildingScheduleVO) {
		
		BuildingSchedulePO buildingSchedulePO = buildingScheduleDao.get(buildingScheduleVO.getBsid());
		
		buildingSchedulePO.setPlanTime(buildingScheduleVO.getPlanTime());
		
		buildingSchedulePO.setComment(buildingScheduleVO.getComment());
		
		buildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingScheduleDao.update(buildingSchedulePO);
		
		BuildingScheduleVO newBuildingScheduleVO = buildingSchedulePOToVO(buildingSchedulePO);
		
		return newBuildingScheduleVO;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public BuildingScheduleVO updateBuildingScheduleForStatus(BuildingScheduleVO buildingScheduleVO) {

		BuildingSchedulePO buildingSchedulePO = buildingScheduleDao.get(buildingScheduleVO.getBsid());
		
		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_END_SHORT);
		
		buildingScheduleDao.update(buildingSchedulePO);
		
		BuildingScheduleVO newBuildingScheduleVO = buildingSchedulePOToVO(buildingSchedulePO);
		
		return newBuildingScheduleVO;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void resetBuildingSchedule(BuildingVO buildingVO, String userId) throws FLException {
		
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBid());
		
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
		
		buildingScheduleDao.resetBuildingSchedule(buildingVO.getBid(), operaterPO.getUid());
		
		//生成新的房产单流转节点	
		List<BuildingNodePO> buildingNodePOs = buildingNodeDao.queryBuildingNodeByType(buildingVO.getPayType(), null, BuildingNodePO.STATUS_ENABLE_SHORT);
		
		BuildingNodePO buildingNodePO = buildingNodePOs.get(0);
		
		BuildingSchedulePO buildingSchedulePO = new BuildingSchedulePO(buildingNodePO, buildingPO, operaterPO);
		
		buildingSchedulePO.setName(buildingNodePO.getName());
		
		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);
		
		buildingScheduleDao.save(buildingSchedulePO);
		
	}
	
	public BuildingScheduleVO buildingSchedulePOToVO(BuildingSchedulePO buildingSchedulePO){
		
		BuildingScheduleVO buildingScheduleVO = new BuildingScheduleVO(new BuildingNodeVO(), new BuildingVO(), new UserVO());
		
		BeanUtil.copyProperties(buildingSchedulePO, buildingScheduleVO, Arrays.asList("building","buildingNode", "operater"));
		
		BeanUtil.copyProperties(buildingSchedulePO.getBuildingNode(), buildingScheduleVO.getBuildingNode());
		
		BeanUtil.copyProperties(buildingSchedulePO.getOperater(), buildingScheduleVO.getOperater(), Arrays.asList("role", "dept", "duty"));
		
		return buildingScheduleVO;
	}
}
