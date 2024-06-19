package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.BuildingHouseRightDao;
import com.fanglin.right.po.BuildingHouseDepartmentRightPO;
import com.fanglin.right.service.BuildingHouseRightService;

@Service("houseSourceRightService")
@Transactional(readOnly = true)
public class BuildingHouseRightServiceImpl implements BuildingHouseRightService {

	@Autowired
	private BuildingHouseRightDao buildingHouseRightDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<Integer> queryBuildingHouseDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<Integer> dids = new ArrayList<Integer>();

		List<BuildingHouseDepartmentRightPO> houseSourceDepartmentRightPOs = buildingHouseRightDao.queryBuildingHouseDepartmentRightByUid(userPO.getUid(), company);

		for (BuildingHouseDepartmentRightPO houseSourceDepartmentRightPO : houseSourceDepartmentRightPOs) {
			dids.add(houseSourceDepartmentRightPO.getDid());
		}

		return dids;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingHouseDepartmentRight(UserBaseVO userBaseVO, List<Integer> dids, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		int uid = userPO.getUid();

		buildingHouseRightDao.deleteBuildingHouseDepartmentRightByUid(userPO.getUid(), company);

		if (dids != null) {
			for (Integer did : dids) {
				buildingHouseRightDao.save(new BuildingHouseDepartmentRightPO(uid, did, company));
			}
		}

	}

}
