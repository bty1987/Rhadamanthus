/**
 * Title: UserServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
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
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityCodeHelper.SecurityCodeLevel;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserInfoVO;
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
	
	@Autowired
	private UserInfoDao userInfoDao;
	
	@Autowired
	private MessageService messageDDService;
	
	@Override
	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, int company) throws FLException{
		
		if(company != CompanyPO.TYPE_HEADQUARTER_INT){
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}
		
		if(userVO != null && userVO.getDuty() != null){
			filters.add(new Filter("duty", userVO.getDuty(), "eq"));
		}

		List<UserPO> userPOs = userDao.pageUser(paging, filters);
		List<UserVO> userVOs = new ArrayList<UserVO>();
		
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}

		paging.setData(userVOs);
	}
	
	@Override
	public UserVO queryUserByLoginId(UserVO userVO) throws FLException{
		
		UserPO userPO = userDao.queryUserByLoginId(userVO.getLoginId());
	
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		if(userPO != null && !userPO.getRole().getRoleId().equals(RolePO.SUPER_ROLEID_STR)){
			userVO = convertBean(userPO);
		}
		
		return userVO;
	}

	@Override
	public UserVO queryUserByUserId(UserVO userVO) throws FLException{

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
	
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		userVO = convertBean(userPO);
	
		return userVO;
	}
	
	@Override
	public UserInfoVO queryUserInfoByUserId(UserInfoVO userInfoVO) throws FLException {
		
		UserVO userVO = userInfoVO.getUser();
	
		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());
		
		if(userInfoPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user"));
		
		userInfoVO.setUser(convertBean(userInfoPO.getUser()));
		
		userInfoVO.getUser().setIdentity(userInfoPO.getUser().getIdentity());
		
		return userInfoVO;
	}

	@Override
	public UserVO queryUserByOldUserId(UserVO userVO) throws FLException{
		UserPO userPO = userDao.queryUserByOldUserId(userVO.getOldUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
	    userVO = convertBean(userPO);
		
		return userVO;
	}
	
	@Override
	public List<UserVO> queryUserByDetpIdADuty(String deptId, String duty){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<Filter> filters = new ArrayList<Filter>();
		filters.add(new Filter("duty", duty, "eq"));
		filters.add(new Filter("deptId", deptId, "eq"));

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

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADuty(paging, pinyinName, duty);
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutys(String pinyinName, List<String> dutys){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutys(paging, pinyinName, dutys);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutyADept(String pinyinName, String duty, String curUserId){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		UserPO userPO = userDao.queryUserByUserId(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutyADeptId(paging, pinyinName, duty, userPO.getDept().getDeptId());
		
		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysADept(String pinyinName, List<String> dutys, String curUserId){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		UserPO userPO = userDao.queryUserByUserId(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysADeptId(paging, pinyinName, dutys, userPO.getDept().getDeptId());

		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAO(String pinyinName, List<String> dutysA, List<String> dutysO){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAO(paging, pinyinName, dutysA, dutysO);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAODept(String pinyinName, List<String> dutysA, List<String> dutysO, String curUserId){
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		UserPO userPO = userDao.queryUserByUserId(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAODeptId(paging, pinyinName, dutysA, dutysO, userPO.getDept().getDeptId());

		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDeptType(String pinyinName, String deptType) {
		
		List<UserVO> userVOs = new ArrayList<UserVO>();
		
		Paging paging = new Paging(0, 50);
		
		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADeptType(paging, pinyinName, deptType);
		
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
				userVO.setCompany(userPO.getCompany());
			}
		}
		
		return userVO;
	}
	
	@Override
	public int resetPassword(String userId) throws FLException{
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null ){
			throw new FLException(190005, "人员不存在");
		}
		
		String newPassword=SecurityCodeHelper.getSecurityCode(8, SecurityCodeLevel.Medium,false).toUpperCase();
		
		userDao.resetPassword(userId, MD5Helper.MD5(newPassword));
		
		messageDDService.sendMessage(userId,userPO.getUserName(),"重置密码,新密码为"+newPassword);
	
		return 0;
	}
	
	private UserVO convertBean(UserPO userPO){
		UserVO userVO = new UserVO(new RoleVO(), new DepartmentVO());
		
		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "password", "identity"));

		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());
		BeanUtil.copyProperties(userPO.getDept(), userVO.getDept(), Arrays.asList("fatherDept", "cityProper"));
		
		if(userPO.getDept().getFatherDept() != null){
			userVO.getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyProperties(userPO.getDept().getFatherDept(), userVO.getDept().getFatherDept(), Arrays.asList("fatherDept", "cityProper"));
		}
		
		return userVO;
	}

}
