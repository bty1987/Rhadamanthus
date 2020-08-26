/**
 * Title: UserContractServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.UserEducationDao;
import com.fanglin.personel.po.UserEducationPO;
import com.fanglin.personel.service.UserEducationService;
import com.fanglin.personel.vo.UserEducationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("userEducationService")
@Transactional(readOnly = true)
public class UserEducationServiceImpl implements UserEducationService {

	@Autowired
	private UserEducationDao userEducationDao;

	@Override
	public List<UserEducationVO> queryUserEducation(UserEducationVO userEducationVO) {
		
		List<UserEducationPO> userEducationPOs = userEducationDao.queryUserEducation(userEducationVO.getUid());
		List<UserEducationVO> userEducationVOs = new ArrayList<UserEducationVO>();
		
		for (UserEducationPO userEducationPO : userEducationPOs) {
			
			userEducationVO = new UserEducationVO();
			
			BeanUtil.copyPropertie(userEducationPO, userEducationVO);
			
			userEducationVOs.add(userEducationVO);
		}
		return userEducationVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserEducation(UserEducationVO userEducationVO) {
		
		UserEducationPO userEducationPO = new UserEducationPO();
		
		BeanUtil.copyPropertie(userEducationVO, userEducationPO);
		
		userEducationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		userEducationDao.save(userEducationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserEducation(UserEducationVO userEducationVO) {
		
		UserEducationPO userEducationPO = userEducationDao.get(userEducationVO.getUeid());
		
		BeanUtil.copyPropertie(userEducationVO, userEducationPO);
		
		userEducationDao.update(userEducationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteUserEducation(UserEducationVO userEducationVO) {
		
		userEducationDao.deleteById(userEducationVO.getUeid());
		
		return 0;
	}


}
