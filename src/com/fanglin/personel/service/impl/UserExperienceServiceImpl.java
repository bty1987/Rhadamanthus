/**
 * Title: UserExperienceServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserExperienceDao;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserExperienceService;
import com.fanglin.personel.vo.UserExperienceVO;
import com.fanglin.utils.BeanUtil;

@Service("userExperienceService")
@Transactional(readOnly = true)
public class UserExperienceServiceImpl implements UserExperienceService {

	@Autowired
	private UserExperienceDao userExperienceDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<UserExperienceVO> queryUserExperienceByUid(UserExperienceVO userExperience) throws FLException {

		List<UserExperienceVO> userExperienceVOs = new ArrayList<UserExperienceVO>();

		UserPO userPO = userDao.get(userExperience.getUid());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<UserExperiencePO> userExperiencePOs = userExperienceDao.queryUserExperiencesByUid(userExperience.getUid());


		for (UserExperiencePO userExperiencePO : userExperiencePOs) {

			UserExperienceVO userExperienceVO = new UserExperienceVO();

			BeanUtil.copyProperties(userExperiencePO, userExperienceVO);

			userExperienceVOs.add(userExperienceVO);
		}

		return userExperienceVOs;
	}

}
