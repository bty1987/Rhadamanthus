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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityCodeHelper.SecurityCodeLevel;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DutyDao;
import com.fanglin.data.common.vo.DutyVO;
import com.fanglin.data.po.DutyPO;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentTypeVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.AssassinService;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.UserExperiencePO;
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
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("userService")
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private UserInfoDao userInfoDao;
	
	@Autowired
	private UserInfoDao userExperienceDao;
	
	@Autowired
	private DepartmentDao departmentDao;
	
	@Autowired
	private DutyDao dutyDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private AssassinService  assassinService;
	
	@Autowired
	private  MessageService  messageService;

	@Override
	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, Integer company) throws FLException{
		
		if(userVO != null && userVO.getDuty() != null){
		
			filters.add(new Filter("duty.name", userVO.getDuty().getName(), "eq"));
		}

		List<UserPO> userPOs = userDao.pageUser(paging, filters,company);
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
	public List<UserVO> queryUserForNameByPinyinName(String pinyinName,Integer company) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 10);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinName(paging, pinyinName, company);

		
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public List<UserVO> queryUserForNameByDuty(String pinyinName, String duty) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 10);
	
		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADuty(paging, pinyinName, duty);
		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		return userVOs;
	}

	@Override
	public List<UserVO> queryUserForNameByDutysAO(String pinyinName, List<String> dutysA, List<String> dutysO) throws FLException{
		List<UserVO> userVOs = new ArrayList<UserVO>();

		Paging paging = new Paging(0, 10);

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinNameADutysAO(paging, pinyinName, dutysA, dutysO);

		for(UserPO userPO: userPOs){
			userVOs.add(convertBean(userPO));
		}
		
		return userVOs;
	}
	
	@Override
	public UserVO validateUser(String loginId, String password) throws FLException{
		
		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;
		
		if(userPO != null){
			if(userPO.getPassword().equals(MD5Helper.MD5(password)) && !userPO.getStatus().equals("离职")){
				
				userVO = new UserVO(new RoleVO(), new DepartmentVO(),new DutyVO());
				
				BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept","duty", "password", "identity","company"));

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
		_userId.append(SystemConfig.getString("userIdent", "FL-"));
		_userId.append(FormatUtil.fillZero(count, "00000"));
		
		userPO.setUserId(_userId.toString());
		
		userPO.setPassword(MD5Helper.MD5(SystemConfig.getString("defaultPassword", "fanglin")));
		userPO.setLoginId(userVO.getLoginId());
		
		userPO.setRole(new RolePO("R_35"));
		userPO.setIsLogin((short) 0);
		userPO.setCompany(company);
		
		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept","duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));
		
		DepartmentPO departmentPO =departmentDao.queryDepartmentByDeptId(userVO.getDept().getDeptId());
		
		userPO.setDept(departmentPO);
		
		userPO.setDuty(new DutyPO(userVO.getDuty().getDid()));
		
		List<String> pinyins = PinYin4Util.getPinyin(userVO.getUserName());
		
		userPO.setUserNamePinYin(pinyins.get(0));
		
		userDao.save(userPO);
		
		userVO.setUid(userPO.getUid());
		
		UserInfoPO userInfoPO = new UserInfoPO();
		
		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user"));
		
		userInfoPO.setUser(userPO);
		
		userInfoDao.save(userInfoPO);
		
		CompanyPO companyPO = companyDao.get(company);
		
		UserExperiencePO userExperiencePO = new UserExperiencePO();
		
		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("入职");
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setComment(String.format("公司:%s,部门:%s,职位:%s", companyPO.getName(), userPO.getDept().getDeptName(), dutyDao.get(userPO.getDuty().getDid()).getName()));

		userExperienceDao.save(userExperiencePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateUser(UserInfoVO userInfoVO, int company) throws FLException {
		
		UserVO userVO = userInfoVO.getUser();
		
		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());
		
		if(userInfoPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		UserPO userPO = userInfoPO.getUser();
		
		String newstatus = userInfoVO.getUser().getStatus();
		String oldstatus = userPO.getStatus();
		
		String newdeptId = userVO.getDept().getDeptId();
		String olddeptId = userPO.getDept().getDeptId();
		
		String newduty = dutyDao.get(userVO.getDuty().getDid()).getName();

		String oldduty = userPO.getDuty().getName();
		
		userVO.setUid(userPO.getUid());
		
		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user"));
		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept","duty","uId", "userId", "userName","userNamePinYin","loginId", "password", "role", "isLogin", "company", "extranet"));
		
		userPO.setDept(new DepartmentPO(userVO.getDept().getDeptId()));
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("fatherDept", "cityProper"));
		
		userPO.setDuty(new DutyPO(userVO.getDuty().getDid()));
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("departmentType"));
		
		userDao.update(userPO);
		
		if(!newstatus.equals(oldstatus) || !newdeptId.equals(olddeptId) || !oldduty.equals(newduty)){
			
			DepartmentPO ndept = departmentDao.queryDepartmentByDeptId(newdeptId);
		
			DepartmentPO odept = departmentDao.queryDepartmentByDeptId(olddeptId);
			
			UserExperiencePO userExperiencePO = new UserExperiencePO();
			
			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType(newstatus.equals(oldstatus) ? "调职" : newstatus.equals("在职") ? "入职" : "离职");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setComment(String.format("原部:%s,原职:%s,现部:%s,现职:%s", odept.getDeptName(), oldduty, ndept.getDeptName(), newduty));
			
			userExperienceDao.save(userExperiencePO);
		}
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
			throw new FLException(190005, "人员不存在");
		}
		
		Short isLogin = userVO.getIsLogin();
		int oldCompany = userPO.getCompany();
		
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
		
		if(oldCompany != userPO.getCompany()){
			
			CompanyPO newCompanyPO = companyDao.get(userPO.getCompany());
			CompanyPO oldCompanyPO = companyDao.get(oldCompany);
			
			UserExperiencePO userExperiencePO = new UserExperiencePO();
			
			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType("调公司");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setComment(String.format("原公司:%s,现公司:%s", oldCompanyPO.getName(), newCompanyPO.getName()));
			
			userExperienceDao.save(userExperiencePO);
		}
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
	public int resetPassword(String userId,Integer company) throws FLException{
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}

		String newPassword=SecurityCodeHelper.getSecurityCode(8, SecurityCodeLevel.Medium,false).toUpperCase();
		
		String EncryptPassword;
		
		try {
			 EncryptPassword= AESHelper.encryptToString(newPassword,SystemConfig.getString("encryptKey"));
		} catch (Exception e) {
			throw new FLException(230015 , "公司不存在");
		}
		
		String api = "resetPassword.do";
		
		String params = String.format("user.userId=%s&password=%s&rePassword=%s", userId,newPassword,EncryptPassword);
		
		String content = String.format("修改密码用户的id为:%s&密码明文=%s&密码密文=%s",userId,newPassword,EncryptPassword);
		
		assassinService.proxy("communion", api, params, content, userPO);

		messageService.sendMessage(userId,"", "修改密码为:"+newPassword,MessagePO.MESSAGE_TYPE_SEND_PERSONEL_STR,company);
		
		return 0;
	}
	
	private UserVO convertBean(UserPO userPO) throws FLException{
		UserVO userVO = new UserVO(new RoleVO(), new DepartmentVO(),new DutyVO());
		
		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept","duty", "password", "identity","company"));
		
		BeanUtil.copyProperties(userPO.getDuty(), userVO.getDuty(),Arrays.asList("departmentType"));

		if(userPO.getDuty().getDepartmentType() != null){
			userVO.getDuty().setDepartmentType(new DepartmentTypeVO());
			BeanUtil.copyProperties(userPO.getDuty().getDepartmentType(), userVO.getDuty().getDepartmentType());
		}
		
		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());
		
		BeanUtil.copyProperties(userPO.getDept(), userVO.getDept(), Arrays.asList("fatherDept", "cityProper","type"));

		if(userPO.getDept().getFatherDept() != null ){
			userVO.getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyProperties(userPO.getDept().getFatherDept(), userVO.getDept().getFatherDept(), Arrays.asList("fatherDept", "cityProper","type"));
		}
		
		if(userPO.getDept().getType() != null){
			userVO.getDept().setType(new DepartmentTypeVO());
			
			BeanUtil.copyProperties(userPO.getDept().getType(), userVO.getDept().getType());
		}
		
		return userVO;
	}
	
	
}
