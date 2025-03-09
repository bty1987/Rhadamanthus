package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingCustomerDao;
import com.fanglin.building.dao.BuildingHouseDao;
import com.fanglin.building.dao.BuildingRecordDao;
import com.fanglin.building.po.BuildingCustomerPO;
import com.fanglin.building.po.BuildingHousePO;
import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.building.service.BuildingRecordService;
import com.fanglin.building.vo.BuildingCustomerVO;
import com.fanglin.building.vo.BuildingHouseVO;
import com.fanglin.building.vo.BuildingRecordVO;
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
public class BuildingRecordServiceImpl implements BuildingRecordService {

	@Autowired
	private BuildingRecordDao buildingRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BuildingHouseDao buildingHouseDao;

	@Autowired
	private BuildingCustomerDao buildingCustomerDao;

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
	@Transactional(rollbackFor = Exception.class)
	public void addBuildingRecord(BuildingRecordVO buildingRecordVO, String userId) {

		UserPO oprateUser = userDao.queryUserByUserId(userId);

		BuildingHousePO buildingHouse = null;

		BuildingCustomerPO buildingCustomerPO = null;

		if (buildingRecordVO.getBuildingHouse() != null && buildingRecordVO.getBuildingHouse().getHsid() != null) {
			buildingHouse = buildingHouseDao.get(buildingRecordVO.getBuildingHouse().getHsid());
		}

		if (buildingRecordVO.getBuildingCustomer() != null && buildingRecordVO.getBuildingCustomer().getCsid() != null) {
			buildingCustomerPO = buildingCustomerDao.get(buildingRecordVO.getBuildingCustomer().getCsid());
		}

		BuildingRecordPO buildingRecordPO = new BuildingRecordPO(buildingHouse, buildingCustomerPO, oprateUser);

		BeanUtil.copyProperties(buildingRecordVO, buildingRecordPO, Arrays.asList("buildingHouse", "buildingCustomer", "operater"));

		buildingRecordPO.setOperatTime(new Timestamp(System.currentTimeMillis()));

		buildingRecordDao.save(buildingRecordPO);

		buildingRecordVO.setBrid(buildingRecordPO.getBrid());

	}

	public BuildingRecordVO buildingRecordPOToVO(BuildingRecordPO buildingRecordPO) {

		BuildingHouseVO buildingHouseVO = new BuildingHouseVO(new HouseVO(new VillageVO()));

		BuildingCustomerVO buildingCustomerVO = new BuildingCustomerVO(new CustomerVO(), new UserBaseVO());

		BuildingRecordVO buildingRecordVO = new BuildingRecordVO(buildingHouseVO, buildingCustomerVO, new UserBaseVO());

		BeanUtil.copyProperties(buildingRecordPO, buildingRecordVO, Arrays.asList("buildingHouse", "buildingCustomer", "operater"));

		BuildingHousePO buildingHousePO = buildingRecordPO.getBuildingHouse();
		if (buildingHousePO != null) {
			BeanUtil.copyProperties(buildingHousePO, buildingHouseVO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));
			if (buildingHousePO.getHouse() != null) buildingHousePO.getHouse().ptv(buildingHouseVO.getHouse());
		}

		BuildingCustomerPO buildingCustomerPO = buildingRecordPO.getBuildingCustomer();
		if (buildingCustomerPO != null) {
			BeanUtil.copyProperties(buildingCustomerPO, buildingCustomerVO, Arrays.asList("customer", "create"));
			BeanUtil.copyProperties(buildingCustomerPO.getCustomer(), buildingCustomerVO.getCustomer());
		}

		// operater
		BeanUtil.copyProperties(buildingRecordPO.getOperater(), buildingRecordVO.getOperater(), Arrays.asList("dept", "duty"));

		return buildingRecordVO;

	}
}
