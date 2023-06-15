package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.personel.service.UserRoleService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserRoleVO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;

@Service("UserRoleService")
@Transactional(readOnly = true)
public class UserRoleServiceImpl implements UserRoleService {

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<UserRoleVO> queryUserRole(UserBaseVO userVO) throws FLException {

		List<UserRoleVO> userRoleVOs = new ArrayList<UserRoleVO>();
		List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userVO.getUid());

		UserRoleVO userRoleVO;

		for (UserRolePO userRolePO : userRolePOs) {

			userRoleVO = new UserRoleVO(new RoleVO(), new UserBaseVO());

			BeanUtil.copyProperties(userRolePO, userRoleVO, Arrays.asList("role", "creater"));

			BeanUtil.copyProperties(userRolePO.getRole(), userRoleVO.getRole(), Arrays.asList("creater"));

			userRoleVOs.add(userRoleVO);
		}

		return userRoleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserRole(UserBaseVO userVO, List<Integer> rids, String userId) throws FLException {

		int uid = userVO.getUid();

		userRoleDao.deleteUserRole(uid);

		UserPO operater = userDao.queryUserByUserId(userId);
		UserPO userPO = userDao.get(uid);

		if (rids == null || rids.size() == 0) return 0;

		if (operater.getRole().getRid() == userPO.getRole().getRid()) return 0;

		if (userPO.getRole().getLevel() >= operater.getRole().getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		for (Integer rid : rids) {

			RolePO rolePO = roleDao.get(rid);

			if (rolePO == null) continue;

			if (rolePO.getRid() == operater.getRole().getRid()) continue;
			if (rolePO.getLevel() >= operater.getRole().getLevel()) continue;

			userRoleDao.save(new UserRolePO(uid, rolePO, operater));
		}

		return 0;
	}

}
