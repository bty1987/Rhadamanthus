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

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("userService")
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CompanyDao companyDao;
	
	@Autowired
	private UserInfoDao userInfoDao;
	
	private	CountingService countingService;
	
	@Override
	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, Integer company) throws FLException{
		
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
		
	   CompanyPO companyPO = companyDao.get(userPO.getCompany());
	   
	   if(companyPO == null){
		   
		   throw new FLException(230015 , "公司不存在");
	   }
		
		userVO = convertBean(userPO);
		
		userVO.setCompanys(companyPO.getName());
	
		return userVO;
	}
	
	@Override
	public UserInfoVO queryUserInfoByUserId(UserInfoVO userInfoVO) throws FLException {
		
		UserVO userVO = userInfoVO.getUser();
	
		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());
		
		if(userInfoPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		CompanyPO companyPO = companyDao.get(userInfoPO.getUser().getCompany());
		
		 if(companyPO == null){
			   
			   throw new FLException(230015 , "公司不存在");
		   }
		 
		BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user"));
		
		userInfoVO.setUser(convertBean(userInfoPO.getUser()));
		
		userInfoVO.getUser().setCompanys(companyPO.getName());
		
		userInfoVO.getUser().setIdentity(userInfoPO.getUser().getIdentity());
		
		return userInfoVO;
	}
	
	@Override
	public UserInfoVO queryUserForSelfByUserId(UserInfoVO userInfoVO) throws FLException {
		
		UserVO userVO = userInfoVO.getUser();
	
		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());
		
		if(userInfoPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user"));
		
		userInfoVO.setUser(convertBean(userInfoPO.getUser()));
		
		
		try {
			userInfoVO.getUser().setCompanys(AESHelper.encryptToString(FormatUtil.encodeCompany(userInfoPO.getUser().getCompany()),SystemConfig.getString("encryptKey")));
		} catch (Exception e) {
		throw new FLException(230015 , "公司不存在");
		}
		
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
	public List<UserVO> queryUserByDetpIdADuty(String deptId, String duty) throws FLException{
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
	public List<UserVO> queryUserForNameByPinyinName(String pinyinName,Integer company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinName(paging, pinyinName, company);

		
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDuty(String pinyinName, String duty,Integer company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADuty(paging, pinyinName, duty,company);
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutys(String pinyinName, List<String> dutys,Integer company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutys(paging, pinyinName, dutys,company);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutyADept(String pinyinName, String duty, String curUserId,Integer  company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		UserPO userPO = userDao.queryUserByUserId(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutyADeptId(paging, pinyinName, duty, userPO.getDept().getDeptId(),company);
		
		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysADept(String pinyinName, List<String> dutys, String curUserId,Integer  company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		UserPO userPO = userDao.queryUserByUserId(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysADeptId(paging, pinyinName, dutys, userPO.getDept().getDeptId(),company);

		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAO(String pinyinName, List<String> dutysA, List<String> dutysO,Integer  company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAO(paging, pinyinName, dutysA, dutysO,company);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAODept(String pinyinName, List<String> dutysA, List<String> dutysO, String curUserId,Integer  company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 50);

		UserPO userPO = userDao.queryUserByUserId(curUserId);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAODeptId(paging, pinyinName, dutysA, dutysO, userPO.getDept().getDeptId(),company);

		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDeptType(String pinyinName, String deptType) throws FLException {
		
		List<UserVO> userVOs = new ArrayList<UserVO>();
		
		Paging paging = new Paging(0, 50);
		
		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADeptType(paging, pinyinName, deptType);
		
		for(UserPO _userPO : userPOs){
			userVOs.add(convertBean(_userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public UserVO validateUser(String loginId, String password) throws FLException{
		
		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;
		
		if(userPO != null){
			if(userPO.getPassword().equals(MD5Helper.MD5(password)) && !userPO.getStatus().equals("离职")){
				
				userVO = new UserVO(new RoleVO(), new DepartmentVO());
				
				BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "password", "identity","company"));

				BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());
				
				userVO.setCompanys(String.valueOf(userPO.getCompany()));
			}
		}
		
		return userVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addUser(UserInfoVO userInfoVO, int company) throws FLException {
		
		UserVO userVO = userInfoVO.getUser();
		
		List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(userVO.getPhone(), userVO.getIdentity());
		
		if(userPOs.size() > 0){
			throw new FLException(190006, "人员已存在");
		}
		
		UserPO userPO = new UserPO();
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_USER_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer _userId = new StringBuffer();
		_userId.append(SystemConfig.getString("companyIdent", ""));
		_userId.append(SystemConfig.getString("userIdent", "FL-"));
		_userId.append(FormatUtil.fillZero(count, "00000"));
		
		userPO.setUserId(_userId.toString());
		
		userPO.setPassword(MD5Helper.MD5(SystemConfig.getString("defaultPassword", "fanglin")));
		userPO.setLoginId(userVO.getLoginId());
		
		userPO.setRole(new RolePO("R_35"));
		userPO.setIsLogin((short) 0);
		userPO.setCompany(company);
		
		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));
		userPO.setDept(new DepartmentPO(userVO.getDept().getDeptId()));
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("fatherDept", "cityProper"));
		
		List<String> pinyins = PinYin4Util.getPinyin(userVO.getUserName());
		
		userPO.setUserNamePinYin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());
		
		userDao.save(userPO);
		
		userVO.setUid(userPO.getUid());
		
		UserInfoPO userInfoPO = new UserInfoPO();
		
		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user"));
		userInfoPO.setUser(userPO);
		
		userInfoDao.save(userInfoPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateUser(UserInfoVO userInfoVO, int company) throws FLException {
		
		UserVO userVO = userInfoVO.getUser();
		
		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());
		
		if(userInfoPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		UserPO userPO = userInfoPO.getUser();
		
		userVO.setUid(userPO.getUid());

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user"));
		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));
		userPO.setDept(new DepartmentPO(userVO.getDept().getDeptId()));
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("fatherDept", "cityProper"));
		
		List<String> pinyins = PinYin4Util.getPinyin(userVO.getUserName());
		
		userPO.setUserNamePinYin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());
		
		userDao.update(userPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateUserForBaseInfo(UserInfoVO userInfoVO) throws FLException{
		
		UserVO userVO = userInfoVO.getUser();
		
		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userInfoVO.getUser().getUserId());
		
		if(userInfoPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		UserPO userPO = userInfoPO.getUser();
		
		userInfoPO.setAge(userInfoVO.getAge());
		userInfoPO.setQq(userInfoVO.getQq());
		userInfoPO.setWechat(userInfoVO.getWechat());
		userInfoPO.setEmail(userInfoVO.getEmail());
		userInfoPO.setEmergencyMan(userInfoVO.getEmergencyMan());
		userInfoPO.setEmergencyPhone(userInfoVO.getEmergencyPhone());
		
		userPO.setPhone(userVO.getPhone());
		userPO.setUserPhoto(userVO.getUserPhoto());
		
		userDao.update(userPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateUserForIsLogin(UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		Short isLogin = userVO.getIsLogin();
		
		if(isLogin != null){
			
			if(isLogin < 0){
				
				isLogin = (short) Math.abs(isLogin);
				
				if((isLogin & userPO.getIsLogin()) == isLogin){
					userPO.setIsLogin((short) (userPO.getIsLogin() - isLogin.shortValue()));
				}
			}else{
				if((isLogin & userPO.getIsLogin()) == 0){
					userPO.setIsLogin((short) (userPO.getIsLogin() + isLogin.shortValue()));
				}
			}
			
			userDao.update(userPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateUserForAdvance(UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		Short isLogin = userVO.getIsLogin();
		
		if(isLogin != null){
			
			if(isLogin < 0){
				
				isLogin = (short) Math.abs(isLogin);
				
				if((isLogin & userPO.getIsLogin()) == isLogin){
					userPO.setIsLogin((short) (userPO.getIsLogin() - isLogin.shortValue()));
				}
			}else{
				if((isLogin & userPO.getIsLogin()) == 0){
					userPO.setIsLogin((short) (userPO.getIsLogin() + isLogin.shortValue()));
				}
			}
		}

		try {
			userPO.setCompany(FormatUtil.decodeCompany(AESHelper.decryptString(userVO.getCompanys(), SystemConfig.getString("encryptKey"))));
		} catch (Exception e) {
			throw new FLException(230017, "公司获取失败");
		}
		userPO.setRole(new RolePO(userVO.getRole().getRoleId()));
		userPO.setExtranet(userVO.getExtranet());
		
		userDao.update(userPO);
	}

	@Override
	@Transactional
	public void checkUserForPassword(String userId, String password, String rePassword) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		if(!userPO.getPassword().equals(MD5Helper.MD5(password))){
			throw new FLException(190001, "旧密码输入错误");
		}
		
		userPO.setPassword(MD5Helper.MD5(rePassword));
		
		userDao.update(userPO);
	}

	@Override
	@Transactional
	public void resetPassword(String userId) throws FLException{
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
//		String password = SecurityCodeHelper.getSecurityCode(8, SecurityCodeLevel.Medium,false).toUpperCase();
		
		userPO.setPassword(SystemConfig.getString("defaultPassword", "fanglin"));
		
		userDao.update(userPO);
	}
	
	private UserVO convertBean(UserPO userPO) throws FLException{
		UserVO userVO = new UserVO(new RoleVO(), new DepartmentVO());
		
		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "password", "identity","company"));

		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());
		BeanUtil.copyProperties(userPO.getDept(), userVO.getDept(), Arrays.asList("fatherDept", "cityProper"));
		
		if(userPO.getDept().getFatherDept() != null){
			userVO.getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyProperties(userPO.getDept().getFatherDept(), userVO.getDept().getFatherDept(), Arrays.asList("fatherDept", "cityProper"));
		}
		
		/*try {
			userVO.setCompanys(AESHelper.encryptToString(FormatUtil.encodeCompany(userPO.getCompany()),SystemConfig.getString("encryptKey")));
		} catch (Exception e) {
			throw new FLException(230015 , "公司不存在");
		}*/

		return userVO;
	}

}
