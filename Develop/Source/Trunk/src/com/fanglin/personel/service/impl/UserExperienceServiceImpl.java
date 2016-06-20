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

import com.fanglin.personel.dao.UserExperienceDao;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.personel.service.UserExperienceService;
import com.fanglin.personel.vo.UserExperienceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("userExperienceService")
@Transactional(readOnly = true)
public class UserExperienceServiceImpl implements UserExperienceService {

	@Autowired
	private UserExperienceDao userExperienceDao;
	
	@Override
	public void pageUserExperienceByUserId(Paging paging, String userId){
		if(userId != null && !userId.equals("")){
			List<UserExperiencePO> userExperiencePOs = userExperienceDao.pageUserExperiencesByUserId(paging, userId);
			List<UserExperienceVO> userExperienceVOs = new ArrayList<UserExperienceVO>();
			
			for(UserExperiencePO userExperiencePO: userExperiencePOs){
				UserExperienceVO userExperienceVO = new UserExperienceVO();
				BeanUtil.copyProperties(userExperiencePO, userExperienceVO);
				
				userExperienceVOs.add(userExperienceVO);
			}
			paging.setData(userExperienceVOs);
		}
	}

}
