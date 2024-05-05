package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.UserFunctionDao;
import com.fanglin.personel.po.UserFunctionPO;
import com.fanglin.personel.vo.UserFunctionVO;
import com.fanglin.right.dao.UserFunctionRightDao;
import com.fanglin.right.po.UserFunctionRightPO;
import com.fanglin.right.service.UserFunctionRightService;
import com.fanglin.right.vo.UserFunctionRightVO;
import com.fanglin.utils.BeanUtil;

@Service("userFunctionRightService")
@Transactional(readOnly = true)
public class UserFunctionRightServiceImpl implements UserFunctionRightService {

	@Autowired
	private UserFunctionRightDao userFunctionRightDao;

	@Autowired
	private UserFunctionDao userFunctionDao;

	@Override
	public List<UserFunctionRightVO> queryUserFunctionRight(UserFunctionRightVO userFunctionRightVO) {

		List<UserFunctionRightPO> userFunctionRightPOs = userFunctionRightDao.queryUserFunctionRight(userFunctionRightVO.getName());
		List<UserFunctionRightVO> userFunctionRightVOs = new ArrayList<UserFunctionRightVO>();

		for (UserFunctionRightPO userFunctionRightPO : userFunctionRightPOs) {

			userFunctionRightVO = new UserFunctionRightVO(new UserFunctionVO());

			BeanUtil.copyPropertie(userFunctionRightPO, userFunctionRightVO, Arrays.asList("userFunction"));
			BeanUtil.copyPropertie(userFunctionRightPO.getUserFunction(), userFunctionRightVO.getUserFunction());

			userFunctionRightVOs.add(userFunctionRightVO);
		}

		return userFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUserFunctionRight(UserFunctionRightVO userFunctionRightVO, List<Long> ufids, int company) {

		userFunctionRightDao.deleteUserFunctionRightByName(userFunctionRightVO.getName());

		for (Long ufid : ufids) {
			UserFunctionRightPO userFunctionRightPO = new UserFunctionRightPO();
			UserFunctionPO userFunctionPO = userFunctionDao.get(ufid);

			userFunctionRightPO.setName(userFunctionRightVO.getName());
			userFunctionRightPO.setUserFunction(userFunctionPO);
			userFunctionRightPO.setCompany(company);

			userFunctionRightDao.save(userFunctionRightPO);
		}

	}

}
