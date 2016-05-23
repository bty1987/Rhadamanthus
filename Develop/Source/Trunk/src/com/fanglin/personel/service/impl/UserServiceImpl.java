/**
 * Title: UserServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("userService")
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageUser(Paging paging, List<FilterVO> filters, String userId) throws FLException{
		
		UserPO _userPO = userDao.get(userId);
		
		if(_userPO == null){
			throw new FLException(190005, "员工不存在");
		}
		
		if(_userPO.getCompany() != CompanyPO.TYPE_HEADQUARTER_INT){
			filters.add(new FilterVO("company", String.valueOf(_userPO.getCompany()), "eq"));
		}

		List<UserPO> userPOs = userDao.pageUser(paging, filters);
		List<UserVO> userVOs = new ArrayList<UserVO>();
		
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}

		paging.setData(userVOs);
	}
	
	@Override
	public void pageUserByNameOPinyinName(Paging paging, UserVO userVO, String userId) throws FLException {
		
		Integer company = null;
		UserPO _userPO = userDao.get(userId);
		
		if(_userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		if(_userPO.getCompany() != CompanyPO.TYPE_HEADQUARTER_INT){
			company = _userPO.getCompany();
		}
		
		List<UserPO> userPOs = userDao.pageUserForNameByPinyinName(paging, userVO.getUserNamePinYin(), company);
		List<UserVO> userVOs = new ArrayList<UserVO>();
		
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}

		paging.setData(userVOs);
	}

	@Override
	@SuppressWarnings("unchecked")
	public void pageUserForResetPassword(Paging paging, List<FilterVO> filters, String userId) throws FLException{
		
		pageUser(paging, filters, userId);
		
		List<UserVO> userVOs = new ArrayList<UserVO>();
		
		for(UserVO userVO: (List<UserVO>) paging.getData()){
			UserVO user = new UserVO();
			user.setUserId(userVO.getUserId());
			user.setUserName(userVO.getUserName());
			user.setLoginId(userVO.getLoginId());
			user.setDuty(userVO.getDuty());
			user.setPhone(userVO.getPhone());
			
			RoleVO roleVO = new RoleVO();
			roleVO.setRoleName(userVO.getRole().getRoleName());
			
			DepartmentVO departmentVO = new DepartmentVO();
			departmentVO.setDeptName(userVO.getDept().getDeptName());
			
			user.setRole(roleVO);
			user.setDept(departmentVO);
			userVOs.add(user);
		}
		
		paging.setData(userVOs);
	}
	
	@Override
	public UserVO queryUserByLoginId(String loginId){
		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;
		
		if(userPO != null && !userPO.getRole().getRoleId().equals(RolePO.SUPER_ROLEID_STR)){
			userVO = convertBean(userPO);
		}
		
		return userVO;
	}
	
	@Override
	public UserVO queryUserByUserId(String userId){
		UserPO userPO = userDao.get(userId);
		UserVO userVO = null;
		
		if(userPO != null){
			userVO = convertBean(userPO);
		}
		
		return userVO;
	}
	
	@Override
	public UserVO queryUserByOldUserId(String oldUserId){
		UserPO userPO = userDao.queryUserByOldUserId(oldUserId);
		UserVO userVO = null;
		
		if(userPO != null){
		    userVO = convertBean(userPO);
		}
		
		return userVO;
	}
	
	@Override
	public List<UserVO> queryUserByDetpIdADuty(String deptId, String duty){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		List<FilterVO> filters = new ArrayList<FilterVO>();
		filters.add(new FilterVO("duty", duty, "eq"));
		filters.add(new FilterVO("deptId", deptId, "eq"));

		List<UserPO> userPOs = userDao.pageUserForWorking(paging, filters);

		for(UserPO userPO : userPOs){
			if(userPO.getRole().getRoleId().equals(RolePO.SUPER_ROLEID_STR))
				continue;
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByPinyinName(String pinyinName){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinName(paging, pinyinName, null);
		
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDuty(String pinyinName, String duty){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADuty(paging, pinyinName, duty);
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutys(String pinyinName, List<String> dutys){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutys(paging, pinyinName, dutys);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDutyADept(String pinyinName, String duty, String curUserId){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		UserPO userPO = userDao.get(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutyADeptId(paging, pinyinName, duty, userPO.getDept().getDeptId());
		
		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDutysADept(String pinyinName, List<String> dutys, String curUserId){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		UserPO userPO = userDao.get(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysADeptId(paging, pinyinName, dutys, userPO.getDept().getDeptId());

		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAO(String pinyinName, List<String> dutysA, List<String> dutysO){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAO(paging, pinyinName, dutysA, dutysO);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAODept(String pinyinName, List<String> dutysA, List<String> dutysO, String curUserId){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		UserPO userPO = userDao.get(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAODeptId(paging, pinyinName, dutysA, dutysO, userPO.getDept().getDeptId());

		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public UserVO validateUser(String loginId, String password){
		
		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;
		
		if(userPO != null){
			if(userPO.getPassword().equals(MD5Helper.MD5(password)) && !userPO.getStatus().equals("离职")){
				userVO = convertBean(userPO);
			}
		}
		
		return userVO;
	}
	
	private UserVO convertBean(UserPO userPO){
		UserVO userVO = new UserVO();
		
		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept"));
		userVO.setRole(new RoleVO());
		userVO.setDept(new DepartmentVO());

		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());
		BeanUtil.copyProperties(userPO.getDept(), userVO.getDept(), Arrays.asList("fatherDept", "cityProper"));
		
		if(userPO.getDept().getFatherDept() != null){
			userVO.getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyProperties(userPO.getDept().getFatherDept(), userVO.getDept().getFatherDept(), Arrays.asList("fatherDept", "cityProper"));
		}
		return userVO;
	}

}
