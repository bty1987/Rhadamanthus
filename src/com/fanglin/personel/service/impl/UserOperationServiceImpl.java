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

import com.fanglin.personel.dao.UserOperationDao;
import com.fanglin.personel.po.UserOperationPO;
import com.fanglin.personel.service.UserOperationService;
import com.fanglin.personel.vo.UserOperationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("userOperationService")
@Transactional(readOnly = true)
public class UserOperationServiceImpl implements UserOperationService {

	@Autowired
	private UserOperationDao userOperationDao;

	@Override
	public List<UserOperationVO> queryUserOperation(UserOperationVO userOperationVO) {
		
		List<UserOperationPO> userOperationPOs = userOperationDao.queryUserOperation(userOperationVO.getUid());
		List<UserOperationVO> userOperationVOs = new ArrayList<UserOperationVO>();
		
		for (UserOperationPO userOperationPO : userOperationPOs) {
			userOperationVO = new UserOperationVO();
			
			BeanUtil.copyPropertie(userOperationPO, userOperationVO);
			
			userOperationVOs.add(userOperationVO);
		}
		
		return userOperationVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserOperation(UserOperationVO userOperationVO) {
		UserOperationPO userOperationPO = new UserOperationPO();
		
		BeanUtil.copyPropertie(userOperationVO, userOperationPO);
		userOperationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		userOperationDao.save(userOperationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserOperation(UserOperationVO userOperationVO) {
		
		UserOperationPO userOperationPO = userOperationDao.get(userOperationVO.getUoid());
		
		BeanUtil.copyPropertie(userOperationVO, userOperationPO);
		
		userOperationDao.update(userOperationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteUserOperation(UserOperationVO userOperationVO) {
		
		userOperationDao.deleteById(userOperationVO.getUoid());
		
		return 0;
	}

}
