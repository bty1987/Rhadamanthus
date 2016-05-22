/**
 * @File Name		: UserCheckServiceImpl.java
 * @Package   	: com.fanglin.personel.service.impl
 * @Version		: 1.0
 * @Date			: 2015-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserCheckDao;
import com.fanglin.personel.po.UserCheckPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserCheckService;
import com.fanglin.personel.vo.UserCheckVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Service("userCheckService")
@Transactional(readOnly=true)
public class UserCheckServiceImpl implements UserCheckService {
	
	@Autowired
	private UserCheckDao userCheckDao;

	@Override
	public List<UserCheckVO> queryUserCheckByUserIdACheckTime(UserCheckVO userCheckVO) {
		
		List<UserCheckPO> userCheckPOs = userCheckDao.queryUserCheckByUserIdACheckTime(userCheckVO.getUserId(), userCheckVO.getCheckDate());
		List<UserCheckVO> userCheckVOs = new ArrayList<UserCheckVO>();
		
		for(UserCheckPO userCheckPO: userCheckPOs){
			UserCheckVO _userCheckVO = new UserCheckVO();
			BeanUtil.copyProperties(userCheckPO, _userCheckVO);
			
			UserPO userPO = userCheckPO.getUser();
			
			_userCheckVO.setUserId(userPO.getUserId());
			_userCheckVO.setCurrentName(userPO.getCurrentName());
			
			userCheckVOs.add(_userCheckVO);
		}
		
		return userCheckVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addUserCheck(UserCheckVO userCheckVO) throws FLException {
		
		boolean checkFlag = false;
		
		double x = userCheckVO.getX();
		double y = userCheckVO.getY();
		
		String checkPoint = SystemConfig.getString("checkPoint");
		double checkRang = SystemConfig.getDouble("checkRang");
		int checkNum = SystemConfig.getInt("checkNum");
		
		String[] checkInfos = checkPoint.split(",");
		
		for(String checkInfo: checkInfos){
			double _x = Double.parseDouble(checkInfo.split(":")[0]);
			double _y = Double.parseDouble(checkInfo.split(":")[1]);
			
			if(Math.abs(x - _x) < checkRang && Math.abs(y - _y) < checkRang){
				checkFlag = true;
				break;
			}
		}
		
		if(!checkFlag){
			throw new FLException(190004, "打卡位置不在范围之内");
		}
		
		if(userCheckDao.countUserCheckByUserIdACheckTime(userCheckVO.getUserId(), userCheckVO.getCheckDate()) > checkNum){
			throw new FLException(190003, "打卡次数超过限制");
		}
		
		UserCheckPO userCheckPO = new UserCheckPO();
		
		BeanUtil.copyProperties(userCheckVO, userCheckPO, Arrays.asList("user"));
		
		userCheckPO.setUser(new UserPO(userCheckVO.getUserId()));
		userCheckPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));
		
		userCheckDao.save(userCheckPO);
		
		userCheckVO.setCheckTime(userCheckPO.getCheckTime());
		userCheckVO.setUcId(userCheckPO.getUcId());
	}

}
