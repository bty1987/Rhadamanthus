package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingRecordDao;
import com.fanglin.building.dao.CustomerSourceDao;
import com.fanglin.building.dao.HouseSourceDao;
import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.building.po.HouseSourcePO;
import com.fanglin.building.service.BuildingRecordService;
import com.fanglin.building.vo.BuildingRecordVO;
import com.fanglin.building.vo.CustomerSourceVO;
import com.fanglin.building.vo.HouseSourceVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("buildingRecordService")
@Transactional(readOnly = true)
public class BuildingRecordServiceImpl implements BuildingRecordService{

	@Autowired
	private BuildingRecordDao buildingRecordDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private HouseSourceDao houseSourceDao;
	
	@Autowired
	private CustomerSourceDao customerSourceDao;
					
	@Override
	public List<BuildingRecordVO> queryBuildingRecord(List<Filter> filters) {
		
		List<BuildingRecordPO> buildingRecordPOs = buildingRecordDao.queryBuildingRecord(filters);
		List<BuildingRecordVO> buildingRecordVOs = new ArrayList<BuildingRecordVO>(); 
		
		for (BuildingRecordPO buildingRecordPO : buildingRecordPOs) {
			
			BuildingRecordVO buildingRecord = buildingRecordPOToVO(buildingRecordPO);
			
			buildingRecordVOs.add(buildingRecord);
			
		}
		
		return buildingRecordVOs;
		
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addBuildingRecord(BuildingRecordVO buildingRecordVO, String userId) {
		
		UserPO oprateUser = userDao.queryUserByUserId(userId);
		
		HouseSourcePO houseSource = null;
		
		CustomerSourcePO customerSourcePO = null;
		
		if(buildingRecordVO.getHouseSource() != null && buildingRecordVO.getHouseSource().getHsid() != null){
			houseSource = houseSourceDao.get(buildingRecordVO.getHouseSource().getHsid());
		}
		
		if(buildingRecordVO.getCustomerSource() != null && buildingRecordVO.getCustomerSource().getCsid() != null){
			customerSourcePO = customerSourceDao.get(buildingRecordVO.getCustomerSource().getCsid());
		}
		
		BuildingRecordPO buildingRecordPO = new BuildingRecordPO(houseSource, customerSourcePO, oprateUser);
		
		BeanUtil.copyProperties(buildingRecordVO, buildingRecordPO, Arrays.asList("houseSource", "customerSource", "operater"));
		
		buildingRecordPO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingRecordDao.save(buildingRecordPO);
		
		buildingRecordVO.setBrid(buildingRecordPO.getBrid());
		
	}
	
	public BuildingRecordVO buildingRecordPOToVO(BuildingRecordPO buildingRecordPO){
		
		HouseSourceVO houseSourceVO = new HouseSourceVO(new HouseVO(new VillageVO()));
		
		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new CustomerVO(), new UserBaseVO());
		
		BuildingRecordVO buildingRecordVO = new BuildingRecordVO(houseSourceVO, customerSourceVO, new UserBaseVO());
		
		BeanUtil.copyProperties(buildingRecordPO, buildingRecordVO, Arrays.asList("houseSource", "customerSource", "operater"));
		
		//hosueSourse
		HouseSourcePO houseSourcePO = buildingRecordPO.getHouseSource();
		if(houseSourcePO != null){
			BeanUtil.copyProperties(houseSourcePO, houseSourceVO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));
			BeanUtil.copyProperties(houseSourcePO.getHouse(), houseSourceVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(houseSourcePO.getHouse().getVillage(), houseSourceVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		}
		
		
		//customerSource
		CustomerSourcePO customerSourcePO = buildingRecordPO.getCustomerSource();
		if(customerSourcePO != null){
			BeanUtil.copyProperties(customerSourcePO, customerSourceVO, Arrays.asList("customer", "create"));
			BeanUtil.copyProperties(customerSourcePO.getCustomer(), customerSourceVO.getCustomer());
		}
		
		//operater
		BeanUtil.copyProperties(buildingRecordPO.getOperater(), buildingRecordVO.getOperater(), Arrays.asList("dept", "duty"));
		
		return buildingRecordVO;
		
	}

}
