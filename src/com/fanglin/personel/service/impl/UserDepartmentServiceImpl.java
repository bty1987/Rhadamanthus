package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDepartmentDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserDepartmentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserDepartmentService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserDepartmentVO;
import com.fanglin.utils.BeanUtil;

@Service("userDepartmentService")
@Transactional(readOnly = true)
public class UserDepartmentServiceImpl implements UserDepartmentService {

	@Autowired
	private UserDepartmentDao userDepartmentDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<UserDepartmentVO> queryUserDepartment(UserBaseVO userVO) throws FLException {

		List<UserDepartmentVO> userDepartmentVOs = new ArrayList<UserDepartmentVO>();
		List<UserDepartmentPO> userDepartmentPOs = userDepartmentDao.queryUserDepartment(userVO.getUid());

		UserDepartmentVO userDepartmentVO;

		for (UserDepartmentPO userDepartmentPO : userDepartmentPOs) {

			userDepartmentVO = new UserDepartmentVO(new DepartmentVO(), new UserBaseVO());

			BeanUtil.copyProperties(userDepartmentPO, userDepartmentVO, Arrays.asList("department", "creater"));

			BeanUtil.copyProperties(userDepartmentPO.getDepartment(), userDepartmentVO.getDepartment(), Arrays.asList("did", "name", "no", "type", "fatherDept"));

			if (userDepartmentPO.getDepartment().getType() != null) {
				userDepartmentVO.getDepartment().setType(new com.fanglin.communion.vo.DepartmentTypeVO());
				BeanUtil.copyProperties(userDepartmentPO.getDepartment().getType(), userDepartmentVO.getDepartment().getType(), Arrays.asList("dtid", "name"));
			}

			userDepartmentVOs.add(userDepartmentVO);
		}

		return userDepartmentVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserDepartment(UserBaseVO userVO, List<Integer> dids, String userId) throws FLException {

		int uid = userVO.getUid();

		userDepartmentDao.deleteUserDepartment(uid);

		UserPO operater = userDao.queryUserByUserId(userId);

		if (dids == null) return 0;

		for (Integer did : dids) {

			DepartmentPO departmentPO = departmentDao.get(did);

			if (departmentPO == null) {
				throw new FLException(-1, "部门不存在");
			}

			userDepartmentDao.save(new UserDepartmentPO(uid, departmentPO, operater));
		}

		return 0;
	}

}
