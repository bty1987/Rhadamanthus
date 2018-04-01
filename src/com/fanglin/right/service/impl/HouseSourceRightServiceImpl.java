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
import com.fanglin.right.dao.HouseSourceRightDao;
import com.fanglin.right.po.HouseSourceDepartmentRightPO;
import com.fanglin.right.service.HouseSourceRightService;

@Service("houseSourceRightService")
@Transactional(readOnly=true)
public class HouseSourceRightServiceImpl implements HouseSourceRightService {
	
	@Autowired
	private HouseSourceRightDao houseSourceRightDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<Integer> queryHouseSourceDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<Integer> dids = new ArrayList<Integer>();
		
		List<HouseSourceDepartmentRightPO> houseSourceDepartmentRightPOs = houseSourceRightDao.queryHouseSourceDepartmentRightByUid(userPO.getUid(), company);
		
		for(HouseSourceDepartmentRightPO houseSourceDepartmentRightPO: houseSourceDepartmentRightPOs){
			dids.add(houseSourceDepartmentRightPO.getDid());
		}
		
		return dids;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateHouseSourceDepartmentRight(UserBaseVO userBaseVO, List<Integer> dids, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		int uid = userPO.getUid();
		
		houseSourceRightDao.deleteHouseSourceDepartmentRightByUid(userPO.getUid(), company);
		
		if(dids != null){
			for(Integer did: dids){
				houseSourceRightDao.save(new HouseSourceDepartmentRightPO(uid, did, company));
			}
		}
		
	}

}
