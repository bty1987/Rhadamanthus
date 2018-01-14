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
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

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
	public void pageBuildingRecord(Paging paging, List<Filter> filters) {
		List<BuildingRecordVO> buildingRecordVOs = new ArrayList<BuildingRecordVO>();
		List<BuildingRecordPO> buildingRecordPOs = buildingRecordDao.pageBuildingRecord(paging, filters);
		
		if(buildingRecordPOs != null){
						
			for (BuildingRecordPO buildingRecordPO : buildingRecordPOs) {
				
				BuildingRecordVO buildingRecordVO = new BuildingRecordVO(new HouseSourceVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserVO(), new UserVO()), new CustomerSourceVO(new CustomerVO(), new UserVO()), new UserVO());
				
				BeanUtil.copyProperties(buildingRecordPO, buildingRecordVO, Arrays.asList("houseSource", "customerSource","operater"));
				
				if(buildingRecordPO.getHouseSource() != null){
					
					BeanUtil.copyProperties(buildingRecordPO.getHouseSource(), buildingRecordVO.getHouseSource(), Arrays.asList("house","customer","create","followUser"));
					
					BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getHouse(), buildingRecordVO.getHouseSource().getHouse(), Arrays.asList("village"));
					BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getHouse().getVillage(), buildingRecordVO.getHouseSource().getHouse().getVillage(), Arrays.asList("cityProper"));
					
					BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getCustomer(), buildingRecordVO.getHouseSource().getCustomer());
					
					BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getCreate(), buildingRecordVO.getHouseSource().getCreate(), Arrays.asList("role", "dept", "duty"));
					
					BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getFollowUser(), buildingRecordVO.getHouseSource().getFollowUser(), Arrays.asList("role", "dept", "duty"));
					
				}
				if(buildingRecordPO.getCustomerSource() != null){
					
					BeanUtil.copyProperties(buildingRecordPO.getCustomerSource(), buildingRecordVO.getCustomerSource(), Arrays.asList("customer","create"));
					
					BeanUtil.copyProperties(buildingRecordPO.getCustomerSource().getCustomer(), buildingRecordVO.getCustomerSource().getCustomer());
					
					BeanUtil.copyProperties(buildingRecordPO.getCustomerSource().getCreate(), buildingRecordVO.getCustomerSource().getCreate(), Arrays.asList("role", "dept", "duty"));
					
				}
				
				BeanUtil.copyProperties(buildingRecordPO.getOperater(), buildingRecordVO.getOperater(), Arrays.asList("role", "dept", "duty"));
				
				buildingRecordVOs.add(buildingRecordVO);
				
				}
			
			}
		
		paging.setData(buildingRecordVOs);
		
		}
					
	@Override
	public List<BuildingRecordVO> queryBuildingRecord(BuildingRecordVO buildingRecordVO) {
		Long hsid;
		Long csid;
		Short type = buildingRecordVO.getType();
		if(buildingRecordVO.getHouseSource() != null){
			hsid = buildingRecordVO.getHouseSource().getHsid();
		}else{
			hsid = null;
		}
		
		if(buildingRecordVO.getCustomerSource() != null){
			csid = buildingRecordVO.getCustomerSource().getCsid();
		}else{
			csid = null;
		}
		
		List<BuildingRecordPO> buildingRecordPOs = buildingRecordDao.queryBuildingRecord(hsid, csid, type);
		List<BuildingRecordVO> buildingRecordVOs = new ArrayList<BuildingRecordVO>(); 
		for (BuildingRecordPO buildingRecordPO : buildingRecordPOs) {
			
			BuildingRecordVO buildingRecord = new BuildingRecordVO(new HouseSourceVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserVO(), new UserVO()), new CustomerSourceVO(new CustomerVO(), new UserVO()), new UserVO());
			
			BeanUtil.copyProperties(buildingRecordPO, buildingRecord, Arrays.asList("houseSource", "customerSource","operater"));
			
			if(buildingRecordPO.getHouseSource() != null){
				
				BeanUtil.copyProperties(buildingRecordPO.getHouseSource(), buildingRecord.getHouseSource(), Arrays.asList("house","customer","create","followUser"));
				
				BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getHouse(), buildingRecord.getHouseSource().getHouse(), Arrays.asList("village"));
				BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getHouse().getVillage(), buildingRecord.getHouseSource().getHouse().getVillage(), Arrays.asList("cityProper", "buildingNameRule"));
				
				BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getCustomer(), buildingRecord.getHouseSource().getCustomer());
				
				BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getCreate(), buildingRecord.getHouseSource().getCreate(), Arrays.asList("role", "dept", "duty"));
				
				BeanUtil.copyProperties(buildingRecordPO.getHouseSource().getFollowUser(), buildingRecord.getHouseSource().getFollowUser(), Arrays.asList("role", "dept", "duty"));
				
			}
			if(buildingRecordPO.getCustomerSource() != null){
				
				BeanUtil.copyProperties(buildingRecordPO.getCustomerSource(), buildingRecord.getCustomerSource(), Arrays.asList("customer","create"));
				
				BeanUtil.copyProperties(buildingRecordPO.getCustomerSource().getCustomer(), buildingRecord.getCustomerSource().getCustomer());
				
				BeanUtil.copyProperties(buildingRecordPO.getCustomerSource().getCreate(), buildingRecord.getCustomerSource().getCreate(), Arrays.asList("role", "dept", "duty"));
				
			}
			
			BeanUtil.copyProperties(buildingRecordPO.getOperater(), buildingRecord.getOperater(), Arrays.asList("role", "dept", "duty"));
			
			buildingRecordVOs.add(buildingRecord);
			
			}
		
		return buildingRecordVOs;
		
		}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBuildingRecord(BuildingRecordVO buildingRecordVO, Authentication authentication) {
		
		UserPO oprateUser = userDao.queryUserByUserId(authentication.getUserId());
		HouseSourcePO houseSource = null;
		CustomerSourcePO customerSourcePO = null;
		
		if(buildingRecordVO.getHouseSource().getHsid() != null){
			houseSource = houseSourceDao.get(buildingRecordVO.getHouseSource().getHsid());
		}
		
		if(buildingRecordVO.getCustomerSource().getCsid() != null){
			customerSourcePO = customerSourceDao.get(buildingRecordVO.getCustomerSource().getCsid());
		}
		
		BuildingRecordPO buildingRecordPO = new BuildingRecordPO(houseSource, customerSourcePO, oprateUser);
		
		BeanUtil.copyProperties(buildingRecordVO, buildingRecordPO, Arrays.asList("houseSource", "customerSource", "operater"));
		
		buildingRecordPO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingRecordDao.save(buildingRecordPO);
		
		buildingRecordVO.setBrid(buildingRecordPO.getBrid());
		
		return 0;
	}

}
