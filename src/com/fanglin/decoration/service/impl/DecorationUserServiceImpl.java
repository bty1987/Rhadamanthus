package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.service.DecorationUserService;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationUserService")
@Transactional(readOnly=true)
public class DecorationUserServiceImpl implements DecorationUserService{
	
	@Autowired
	private DecorationUserDao decorationUserDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<DecorationUserVO> queryDecorationUser(Paging paging,List<Filter> filters,DecorationUserVO decorationUserVO) {
		
		String orderId = decorationUserVO.getOrderId();
		
		List<DecorationUserPO> decorationUserPOs = decorationUserDao.queryDecorationUser(paging, filters, orderId);
		List<DecorationUserVO> decorationUserVOs = new ArrayList<DecorationUserVO>();
		
		for (DecorationUserPO decorationUserPO : decorationUserPOs) {
			DecorationUserVO decorationUser = new DecorationUserVO(new UserBaseVO(new DutyVO()));
			BeanUtil.copyPropertie(decorationUserPO,decorationUser,Arrays.asList("user"));
			BeanUtil.copyPropertie(decorationUserPO.getUser(), decorationUser.getUser(), Arrays.asList("duty","dept","role"));
			BeanUtil.copyPropertie(decorationUserPO.getUser().getDuty(), decorationUser.getUser().getDuty(), Arrays.asList("departmentType"));
			decorationUserVOs.add(decorationUser);
		}
		
		paging.setData(decorationUserVOs);
		
		return decorationUserVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationUser(DecorationUserVO decorationUserVO,Authentication authentication) {
		
		UserPO userPO = userDao.queryUserByUserId(decorationUserVO.getUser().getUserId());

		DecorationUserPO decorationUserPO = new DecorationUserPO();
		
		BeanUtil.copyPropertie(decorationUserVO, decorationUserPO,Arrays.asList("user"));
		decorationUserPO.setUser(userPO);
		
		decorationUserDao.save(decorationUserPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteDecorationUser(DecorationUserVO decorationUserVO) {
		
		DecorationUserPO decorationUserPO = decorationUserDao.get(decorationUserVO.getDuid());

		decorationUserDao.delete(decorationUserPO);
		
		return 0;
	}

}
