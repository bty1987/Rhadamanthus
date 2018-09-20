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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityCodeHelper.SecurityCodeLevel;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.MessagePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("userService")
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

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
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Override
	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, Integer company) throws FLException {

		if (userVO != null && userVO.getDuty() != null) {
			filters.add(new Filter("duty.name", userVO.getDuty().getName(), "eq"));
		}

		List<UserPO> userPOs = userDao.pageUser(paging, filters, company);
		List<UserVO> userVOs = new ArrayList<UserVO>();

		for (UserPO userPO : userPOs) {
			userVOs.add(convertBean(userPO));
		}

		paging.setData(userVOs);
	}

	@Override
	public UserVO queryUserByLoginId(UserVO userVO) throws FLException {

		UserPO userPO = userDao.queryUserByLoginId(userVO.getLoginId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (userPO != null && !userPO.getRole().getNo().equals(RolePO.SUPER_NO_STR)) {

			userVO = convertBean(userPO);
		}

		return userVO;
	}

	@Override
	public UserVO queryUserByUserId(UserVO userVO) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		CompanyPO companyPO = companyDao.get(userPO.getCompany());

		if (companyPO == null) {

			throw new FLException(230015, "公司不存在");
		}

		userVO = convertBean(userPO);

		userVO.setCompanys(companyPO.getName());

		return userVO;
	}

	@Override
	public UserInfoVO queryUserInfoByUserId(UserInfoVO userInfoVO) throws FLException {

		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		if (userInfoPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		CompanyPO companyPO = companyDao.get(userInfoPO.getUser().getCompany());

		if (companyPO == null) {

			throw new FLException(230015, "公司不存在");
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

		if (userInfoPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user"));

		userInfoVO.setUser(convertBean(userInfoPO.getUser()));

		try {
			userInfoVO.getUser().setCompanys(AESHelper.encryptToString(FormatUtil.encodeCompany(userInfoPO.getUser().getCompany()), SystemConfig.getString("encryptKey")));
		} catch (Exception e) {
			throw new FLException(230015, "公司不存在");
		}

		userInfoVO.getUser().setIdentity(userInfoPO.getUser().getIdentity());

		return userInfoVO;
	}

	@Override
	public UserVO queryUserByOldUserId(UserVO userVO) throws FLException {
		UserPO userPO = userDao.queryUserByOldUserId(userVO.getOldUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		userVO = convertBean(userPO);

		return userVO;
	}

	@Override
	public List<UserBaseVO> queryUserByPinyin(String pinyinName, UserVO userVO, DepartmentTypeVO departmentType, int company) throws FLException {

		List<UserBaseVO> userBaseVOs = new ArrayList<UserBaseVO>();

		Paging paging = new Paging(0, 10);

		int dtid = 0;

		if (departmentType != null && departmentType.getName() != null && departmentType.getName().length() != 0) {

			dtid = departmentTypeDao.queryDepartmentTypeByName(departmentType.getName()).getDtid();

		}

		List<UserPO> userPOs = userDao.pageUserForNameByPinyinName(paging, pinyinName, userVO.getStatus(), dtid, company);

		for (UserPO userPO : userPOs) {

			userBaseVOs.add(convertBaseBean(userPO));

		}

		return userBaseVOs;
	}

	@Override
	public UserVO validateUser(String loginId, String password) throws FLException {

		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;

		if (userPO != null) {
			if (userPO.getPassword().equals(MD5Helper.MD5(password)) && userPO.getStatus() != 1) {

				userVO = new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO());

				BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
				BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());

				userVO.setCompanys(String.valueOf(userPO.getCompany()));
			}
		}

		return userVO;
	}

	@Override
	public List<UserBaseVO> queryUserByUids(List<Integer> uids) throws FLException {

		List<UserBaseVO> userBaseVOs = new ArrayList<UserBaseVO>();

		List<UserPO> userPOs = userDao.queryUserByUids(uids);

		for (UserPO userPO : userPOs) {

			userBaseVOs.add(convertBaseBean(userPO));

		}

		return userBaseVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addUser(UserInfoVO userInfoVO, int company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("userlimit", company);
		
		if(userDao.countUserByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))){
			throw new FLException(190008, "人员数已达上限");
		}
		
		UserVO userVO = userInfoVO.getUser();

		List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(userVO.getPhone(), userVO.getIdentity());

		if (userPOs.size() > 0) {
			throw new FLException(190006, "人员已存在");
		}

		UserPO userPO = new UserPO();

		DepartmentPO departmentPO = departmentDao.get(userVO.getDept().getDid());

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		SystemConfigPO visitor = systemConfigDao.querySystemConfig("visitor"); // 游客角色ID

		if (visitor == null) {
			throw new FLException(230010, "角色不存在");
		}
		
		SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_USER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer _userId = new StringBuffer();
		_userId.append(SystemConfig.getInt("multicompany", 0) != 0 ? String.format("%sU-", companyPO.getShortname()) : "FL-");
		_userId.append(FormatUtil.fillZero(count, "00000"));

		userPO.setUserId(_userId.toString());

		userPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));
		userPO.setLoginId(userVO.getLoginId());

		userPO.setRole(new RolePO(Integer.valueOf(visitor.getValue())));
		userPO.setIsLogin((short) 0);
		userPO.setCompany(company);

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		userPO.setDept(departmentPO);

		userPO.setDuty(new DutyPO(userVO.getDuty().getDid()));

		List<String> pinyins = PinYin4Util.getPinyin(userVO.getCurrentName());

		userPO.setPinYin(pinyins.get(0));

		userDao.save(userPO);

		userVO.setUid(userPO.getUid());

		UserInfoPO userInfoPO = new UserInfoPO();

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user"));

		userInfoPO.setUser(userPO);

		userInfoDao.save(userInfoPO);

		UserExperiencePO userExperiencePO = new UserExperiencePO();

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("入职");
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setComment(String.format("公司:%s,部门:%s,职位:%s", companyPO.getName(), userPO.getDept().getDeptName(), dutyDao.get(userPO.getDuty().getDid()).getName()));

		userExperienceDao.save(userExperiencePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUser(UserInfoVO userInfoVO, int company) throws FLException {

		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		if (userInfoPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		UserPO userPO = userInfoPO.getUser();

		DepartmentPO departmentPO = departmentDao.get(userVO.getDept().getDid());

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		short newstatus = userInfoVO.getUser().getStatus();
		short oldstatus = userPO.getStatus();

		int newdeptId = userVO.getDept().getDid();
		int olddeptId = userPO.getDept().getDid();

		String newduty = dutyDao.get(userVO.getDuty().getDid()).getName();
		String oldduty = userPO.getDuty().getName();

		userVO.setUid(userPO.getUid());

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user"));
		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "userName", "loginId", "password", "role", "isLogin", "company", "extranet"));

		userPO.setDept(departmentPO);
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("fatherDept", "cityProper"));

		userPO.setDuty(new DutyPO(userVO.getDuty().getDid()));
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("departmentType"));

		List<String> pinyins = PinYin4Util.getPinyin(userVO.getCurrentName());

		userPO.setPinYin(pinyins.get(0));

		userDao.update(userPO);

		if (newstatus != oldstatus || newdeptId != olddeptId || !oldduty.equals(newduty)) {

			DepartmentPO ndept = departmentDao.get(newdeptId);

			DepartmentPO odept = departmentDao.get(olddeptId);

			UserExperiencePO userExperiencePO = new UserExperiencePO();

			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType((newstatus == oldstatus) ? "调职" : newstatus == 0 ? "入职" : "离职");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setComment(String.format("原部:%s,原职:%s,现部:%s,现职:%s", odept.getDeptName(), oldduty, ndept.getDeptName(), newduty));

			userExperienceDao.save(userExperiencePO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUserForBaseInfo(UserInfoVO userInfoVO) throws FLException {

		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userInfoVO.getUser().getUserId());

		if (userInfoPO == null) {
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
	@Transactional(rollbackFor = Exception.class)
	public void updateUserForIsLogin(UserVO userVO) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		Short isLogin = userVO.getIsLogin();

		if (isLogin != null) {

			if (isLogin < 0) {

				isLogin = (short) Math.abs(isLogin);

				if ((isLogin & userPO.getIsLogin()) == isLogin) {
					userPO.setIsLogin((short) (userPO.getIsLogin() - isLogin.shortValue()));
				}
			} else {
				if ((isLogin & userPO.getIsLogin()) == 0) {
					userPO.setIsLogin((short) (userPO.getIsLogin() + isLogin.shortValue()));
				}
			}

			userDao.update(userPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUserForAdvance(UserVO userVO) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		Short isLogin = userVO.getIsLogin();
		int oldCompany = userPO.getCompany();

		if (isLogin != null) {

			if (isLogin < 0) {

				isLogin = (short) Math.abs(isLogin);

				if ((isLogin & userPO.getIsLogin()) == isLogin) {
					userPO.setIsLogin((short) (userPO.getIsLogin() - isLogin.shortValue()));
				}
			} else {
				if ((isLogin & userPO.getIsLogin()) == 0) {
					userPO.setIsLogin((short) (userPO.getIsLogin() + isLogin.shortValue()));
				}
			}
		}

		try {
			userPO.setCompany(FormatUtil.decodeCompany(AESHelper.decryptString(userVO.getCompanys(), SystemConfig.getString("encryptKey"))));
		} catch (Exception e) {
			if(SystemConfig.getInt("multicompany", 0) == 0) throw new FLException(230017, "公司获取失败");
		}
		userPO.setRole(new RolePO(userVO.getRole().getRid()));
		userPO.setExtranet(userVO.getExtranet());

		userDao.update(userPO);

		if (oldCompany != userPO.getCompany()) {

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
	public void checkUserForPassword(String userId, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}
		
		SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);
		
		userPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));
		
		userDao.update(userPO);
	}

	@Override
	@Transactional
	public void checkUserForPassword(String userId, String password, String rePassword) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		if (!userPO.getPassword().equals(MD5Helper.MD5(password))) {
			throw new FLException(190001, "旧密码输入错误");
		}

		userPO.setPassword(MD5Helper.MD5(rePassword));

		userDao.update(userPO);
	}

	@Override
	@Transactional
	public int resetPassword(UserVO userVO, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		String newPassword = SecurityCodeHelper.getSecurityCode(8, SecurityCodeLevel.Medium, false).toUpperCase();

		String api = "sendMessage.do";

		String params = String.format("message.receiver.userId=%s&message.sender.userId=%s&message.type=%s&message.contents=%s&company=%s", userVO.getUserId(), "", MessagePO.MESSAGE_TYPE_SEND_PERSONEL_STR, "修改密码为:" + newPassword, company);

		String communion = systemConfigDao.querySystemConfig("communion").getValue();
		String code = systemConfigDao.querySystemConfig("tokenkey").getValue();
		String secret = systemConfigDao.querySystemConfig("tokensecret").getValue();

		String server = systemConfigDao.querySystemConfig("platform").getValue();

		String str = String.format("%s/requestAuthCode.do?userId=%s&code=%s&secret=%s", communion, userPO.getUserId(), code, secret);

		JSONObject result = HttpUtil.httpGet(str);

		String authentication;

		if (result != null && result.containsKey("authentication")) {
			authentication = result.get("authentication").toString();
		} else {
			throw new FLException(110010, "请求失败");
		}

		String url = String.format("%s/%s?authentication=%s&%s", server, api, authentication, params);

		JSONObject results = HttpUtil.httpGet(url);

		int errorCode = results.getInteger("errorCode");
		String errorMsg = results.getString("errorMsg");

		if (errorCode == 0) {

			userPO.setPassword(MD5Helper.MD5(newPassword));

			userDao.update(userPO);

		} else {
			LogUtils.logging(logger, server, results.getString("errorMsg"), api);
			throw new FLException(errorCode, errorMsg);
		}

		return 0;
	}

	@Override
	@Transactional
	public void updateUserForProfiles(UserInfoVO userInfoVO) throws FLException {

		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		if (userInfoPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		userInfoPO.setProfiles(userInfoVO.getProfiles());

		userInfoDao.update(userInfoPO);

	}

	private UserVO convertBean(UserPO userPO) throws FLException {

		UserVO userVO = new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO());

		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

		BeanUtil.copyProperties(userPO.getDuty(), userVO.getDuty(), Arrays.asList("departmentType"));

		if (userPO.getDuty().getDepartmentType() != null) {
			userVO.getDuty().setDepartmentType(new DepartmentTypeVO());
			BeanUtil.copyProperties(userPO.getDuty().getDepartmentType(), userVO.getDuty().getDepartmentType());
		}

		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());

		BeanUtil.copyProperties(userPO.getDept(), userVO.getDept(), Arrays.asList("fatherDept", "cityProper", "type"));

		if (userPO.getDept().getFatherDept() != null) {
			userVO.getDept().setFatherDept(new DepartmentVO());

			BeanUtil.copyProperties(userPO.getDept().getFatherDept(), userVO.getDept().getFatherDept(), Arrays.asList("fatherDept", "cityProper", "type"));
		}

		if (userPO.getDept().getType() != null) {
			userVO.getDept().setType(new DepartmentTypeVO());

			BeanUtil.copyProperties(userPO.getDept().getType(), userVO.getDept().getType());
		}

		return userVO;
	}

	private UserBaseVO convertBaseBean(UserPO userPO) throws FLException {
		UserBaseVO userBaseVO = new UserBaseVO(new DutyVO(), new DepartmentVO());

		BeanUtil.copyProperties(userPO, userBaseVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

		BeanUtil.copyProperties(userPO.getDuty(), userBaseVO.getDuty(), Arrays.asList("departmentType"));

		BeanUtil.copyProperties(userPO.getDept(), userBaseVO.getDept(), Arrays.asList("fatherDept", "cityProper", "type"));

		return userBaseVO;
	}

}
