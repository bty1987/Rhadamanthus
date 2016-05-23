/**
 * Title: UserContractServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.personel.service.UserContractService;
import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("userContractService")
@Transactional(readOnly = true)
public class UserContractServiceImpl implements UserContractService {

	@Autowired
	private UserContractDao userContractDao;
	
	@Override
	public void pageUserContractByUserId(Paging paging, String userId){
		
		if(userId != null && !userId.equals("")){
			List<UserContractPO> userContractPOs = userContractDao.pageUserContractByUserId(paging, userId);
			List<UserContractVO> userContractVOs = new ArrayList<UserContractVO>();
			
			for(UserContractPO userContractPO: userContractPOs){
				UserContractVO userContractVO = new UserContractVO();
				BeanUtil.copyProperties(userContractPO, userContractVO);
				userContractVOs.add(userContractVO);
			}
			
			paging.setData(userContractVOs);
		}
	}
	
	@Override
	public List<UserContractVO> queryUserContractByUserId(String userId){
		List<UserContractVO> userContractVOs = new ArrayList<UserContractVO>();
		
		if(userId != null && !userId.equals("")){
			List<UserContractPO> userContractPOs = userContractDao.queryUserContractByUserId(userId);
			
			for(UserContractPO userContractPO: userContractPOs){
				UserContractVO userContractVO = new UserContractVO();
				BeanUtil.copyProperties(userContractPO, userContractVO);
				
				userContractVOs.add(userContractVO);
			}
		}
		return userContractVOs;
	}

}
