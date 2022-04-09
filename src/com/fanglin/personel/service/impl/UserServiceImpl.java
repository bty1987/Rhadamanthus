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
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserEducationDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserOperationDao;
import com.fanglin.personel.po.DutmentPO;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.personel.po.UserEducationPO;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserOperationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.personel.vo.UserEducationVO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserOperationVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.RoleDao;
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
	private RoleDao roleDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Autowired
	private DutmentDao dutmentDao;

	@Autowired
	private UserContractDao userContractDao;

	@Autowired
	private UserEducationDao userEducationDao;

	@Autowired
	private UserOperationDao userOperationDao;

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
	public void pageUserInfo(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<UserInfoPO> userInfoPOs = userInfoDao.pageUserInfo(paging, filters, company);
		List<UserInfoVO> userInfoVOs = new ArrayList<UserInfoVO>();

		for (UserInfoPO userInfoPO : userInfoPOs) {

			UserInfoVO userInfoVO = new UserInfoVO();

			BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user", "fangliner"));

			UserVO userVO = convertBean(userInfoPO.getUser());
			userVO.setIdentity(userInfoPO.getUser().getIdentity());
			userInfoVO.setUser(userVO);

			if (userInfoPO.getFangliner() != null) {
				userInfoVO.setFangliner(convertBean(userInfoPO.getFangliner()));
			}

			userInfoVOs.add(userInfoVO);
		}

		paging.setData(userInfoVOs);
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
		BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user", "fangliner"));

		if (userInfoPO.getFangliner() != null) {
			userInfoVO.setFangliner(convertBean(userInfoPO.getFangliner()));
		}

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

		BeanUtil.copyProperties(userInfoPO, userInfoVO, Arrays.asList("user", "fangliner"));

		userInfoVO.setUser(convertBean(userInfoPO.getUser()));

		if (userInfoPO.getFangliner() != null) {
			userInfoVO.setFangliner(convertBean(userInfoPO.getFangliner()));
		}

		try {
			userInfoVO.getUser().setCompanys(AESHelper.encrypt(FormatUtil.encodeCompany(userInfoPO.getUser().getCompany()), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
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

		if (userVO.getStatus() == null) {
			userVO.setStatus(UserPO.STATUS_ONJOB_INT);
		}

		int dtid = 0;

		if (departmentType != null && departmentType.getName() != null && departmentType.getName().length() != 0) {

			dtid = departmentTypeDao.queryDepartmentTypeByName(departmentType.getName()).getDtid();
		}

		List<UserPO> userPOs = userDao.pageUserByPinyin(paging, pinyinName, userVO.getStatus(), company, dtid);

		for (UserPO userPO : userPOs) {
			userBaseVOs.add(convertBaseBean(userPO));
		}

		return userBaseVOs;
	}

	@Override
	public UserVO validateUser(String loginId, String password) throws FLException {

		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;

		if (userPO == null) return userVO;

		if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) return userVO;

		if (!userPO.getPassword().equals(MD5Helper.MD5(password))) return userVO;

		userVO = new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO());

		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());

		userVO.setCompanys(String.valueOf(userPO.getCompany()));

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
	public void addUser(UserInfoVO userInfoVO, List<UserContractVO> userContractVOs, List<UserEducationVO> userEducationVOs, List<UserOperationVO> userOperationVOs, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("userlimit", company);

		if (userDao.countUserByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
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

		DutmentPO dutmentPO = dutmentDao.queryDutmentByDids(userInfoVO.getUser().getDept().getDid(), userInfoVO.getUser().getDuty().getDid());

		if (departmentPO.getIsdet() == DepartmentPO.ISDET_DETMENT_INT && dutmentPO == null) {
			throw new FLException(130050, "定岗信息不存在");
		}

		if (dutmentPO != null) {

			if (dutmentPO.getNum() >= dutmentPO.getLimit()) {
				throw new FLException(190011, "人员数量已达上限");
			}

			dutmentPO.setNum(dutmentPO.getNum() + 1);

			dutmentDao.update(dutmentPO);
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

		userPO.setGender(String.valueOf(userInfoVO.getGender()).equals("0") ? "女" : "男");
		userPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));
		userPO.setLoginId(userVO.getLoginId());

		userPO.setRole(new RolePO(Integer.valueOf(visitor.getValue())));

		userPO.setIsLogin(UserPO.ISLOGIN_NOT_INT);
		userPO.setExtranet(UserPO.EXTRANET_QCODE_INT);
		userPO.setType(UserPO.TYPE_USER_INT);
		userPO.setCompany(company);

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		userPO.setDept(departmentPO);

		userPO.setDuty(new DutyPO(userVO.getDuty().getDid()));

		userPO.setPinYin(PinYin4Util.getPinyin(userVO.getCurrentName()).get(0));

		userPO.setIsUpdate(UserPO.ISUPDATE_ADD_INT);

		userDao.save(userPO);

		userVO.setUid(userPO.getUid());

		UserInfoPO userInfoPO = new UserInfoPO();

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user", "fangliner"));

		if (userInfoVO.getFangliner().getUserId() != null) {
			UserPO fangliner = userDao.queryUserByUserId(userInfoVO.getFangliner().getUserId());
			userInfoPO.setFangliner(fangliner);
		}

		if (userContractVOs != null && userContractVOs.size() != 0) {

			for (UserContractVO userContractVO : userContractVOs) {
				UserContractPO usercontract = new UserContractPO();

				String currentDate = DateUtil.current("yyMMdd").toString();
				int count1 = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);
				String no = companyPO.getShortname() + "P" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count1), "0000");

				BeanUtil.copyPropertie(userContractVO, usercontract);
				usercontract.setUid(userPO.getUid());
				usercontract.setNo(no);
				usercontract.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

				userContractDao.save(usercontract);
			}
		}

		if (userEducationVOs != null && userEducationVOs.size() != 0) {
			for (UserEducationVO userEducationVO : userEducationVOs) {
				UserEducationPO userEducationPO = new UserEducationPO();

				BeanUtil.copyPropertie(userEducationVO, userEducationPO);
				userEducationPO.setUid(userPO.getUid());
				userEducationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				userEducationDao.save(userEducationPO);
			}
		}

		if (userOperationVOs != null && userOperationVOs.size() != 0) {
			for (UserOperationVO userOperationVO : userOperationVOs) {
				UserOperationPO userOperationPO = new UserOperationPO();

				BeanUtil.copyPropertie(userOperationVO, userOperationPO);
				userOperationPO.setUid(userPO.getUid());
				userOperationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				userOperationDao.save(userOperationPO);
			}
		}

		userInfoPO.setUser(userPO);

		userInfoDao.save(userInfoPO);

		UserExperiencePO userExperiencePO = new UserExperiencePO();

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("入职");
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setComment(String.format("公司:%s,部门:%s,职位:%s", companyPO.getName(), userPO.getDept().getName(), dutyDao.get(userPO.getDuty().getDid()).getName()));

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

		DepartmentPO newdept = departmentPO;
		DepartmentPO olddept = userPO.getDept();

		DutyPO newduty = dutyDao.get(userVO.getDuty().getDid());
		DutyPO oldduty = userPO.getDuty();

		userVO.setUid(userPO.getUid());

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user", "fangliner"));

		if (userInfoVO.getFangliner().getUserId() != null) {
			UserPO fangliner = userDao.queryUserByUserId(userInfoVO.getFangliner().getUserId());
			userInfoPO.setFangliner(fangliner);
		}

		userInfoDao.update(userInfoPO);

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "userName", "loginId", "password", "role", "isLogin", "company", "extranet"));

		userPO.setDept(departmentPO);
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("fatherDept", "type", "manager"));

		userPO.setDuty(new DutyPO(userVO.getDuty().getDid()));
		BeanUtil.copyProperties(userVO.getDept(), userPO.getDept(), Arrays.asList("departmentType"));

		List<String> pinyins = PinYin4Util.getPinyin(userVO.getCurrentName());

		userPO.setPinYin(pinyins.get(0));

		if (userPO.getIsUpdate() == UserPO.ISUPDATE_INIT_INT) {
			userPO.setIsUpdate(UserPO.ISUPDATE_UPDATE_INT);
		}

		userDao.update(userPO);

		userDao.flush();

		if (newstatus != oldstatus || newdept.getDid() != olddept.getDid() || oldduty.getDid() != newduty.getDid()) {

			DutmentPO olddutment = dutmentDao.queryDutmentByDids(olddept.getDid(), oldduty.getDid());
			DutmentPO newdutment = dutmentDao.queryDutmentByDids(newdept.getDid(), newduty.getDid());

			int oldCount = userDao.countUserByDid(olddept.getDid(), oldduty.getDid(), company);
			int newCount = userDao.countUserByDid(newdept.getDid(), newduty.getDid(), company);

			if (olddutment != null) {
				if (newstatus != oldstatus && newstatus == 0) {
					if (olddutment.getNum() >= olddutment.getLimit()) {
						throw new FLException(190011, "人员数量已达上限");
					}
				}

				olddutment.setNum(oldCount);
				dutmentDao.update(olddutment);
			}

			if (newdutment != null && olddutment != newdutment) {
				if (newdutment.getNum() >= newdutment.getLimit()) {
					throw new FLException(190011, "人员数量已达上限");
				}

				newdutment.setNum(newCount);
				dutmentDao.update(newdutment);
			}

			UserExperiencePO userExperiencePO = new UserExperiencePO();

			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType((newstatus == oldstatus) ? "调职" : newstatus == 0 ? "入职" : "离职");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

			userExperiencePO.setComment(String.format("原部:%s,原职:%s,现部:%s,现职:%s", olddept.getName(), oldduty.getName(), newdept.getName(), newduty.getName()));

			userExperienceDao.save(userExperiencePO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUserForPhoto(UserVO userVO) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		userPO.setUserPhoto(userVO.getUserPhoto());
		userPO.setIdentityPathF(userVO.getIdentityPathF());
		userPO.setIdentityPathB(userVO.getIdentityPathB());

		userDao.update(userPO);

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

		userInfoPO.setQq(userInfoVO.getQq());
		userInfoPO.setWechat(userInfoVO.getWechat());
		userInfoPO.setEmail(userInfoVO.getEmail());
		userInfoPO.setEmergencyMan(userInfoVO.getEmergencyMan());
		userInfoPO.setEmergencyPhone(userInfoVO.getEmergencyPhone());

		userPO.setPhone(userVO.getPhone());
		userPO.setUserPhoto(userVO.getUserPhoto());
		userPO.setIdentityPathF(userVO.getIdentityPathF());

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
	public void updateUserForAdvance(UserVO userVO, int rid) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		RolePO roleCO = roleDao.get(rid);

		if (roleCO == null) {
			throw new FLException(230010, "角色不存在");
		}

		RolePO rolePO = roleDao.get(userVO.getRole().getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		if (roleCO.getLevel() <= rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
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

		userPO.setCompany(FormatUtil.decodeCompany(AESHelper.decrypt(userVO.getCompanys(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"))));

		userPO.setRole(rolePO);
		userPO.setExtranet(userVO.getExtranet());
		userPO.setIsUpdate(UserPO.ISUPDATE_UPDATE_INT);

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
	public void resetPassword(UserVO userVO, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		String newPassword = SecurityCodeHelper.getSecurityCode(8, SecurityCodeLevel.Medium, false).toUpperCase();

		String api = "sendMessage.do";

		String params = String.format("message.receiver.userId=%s&message.sender.userId=%s&message.type=%s&message.contents=%s&company=%s", userVO.getUserId(), "", MessagePO.TYPE_SEND_PERSONEL_INT, "修改密码为:" + newPassword, company);

		String communion = systemConfigDao.querySystemConfig("communion").getValue();
		String code = systemConfigDao.querySystemConfig("tokenkey").getValue();
		String secret = systemConfigDao.querySystemConfig("tokensecret").getValue();

		String server = systemConfigDao.querySystemConfig("platform").getValue();

		String str = String.format("%s/requestAuthCode.do?userId=%s&code=%s&secret=%s", communion, userPO.getUserId(), code, secret);

		JSONObject result = HttpUtil.httpGet(str);

		String authentication;

		if (result != null && result.containsKey("authentication")) {
			authentication = result.get("authentication").toString().replaceAll("[\\r\\n]", "").replaceAll("\\+", "%2B");
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
	}

	@Override
	@Transactional
	public void defaultPassword(String userId, int company) throws FLException {

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
	public void updateUserForProfile(UserInfoVO userInfoVO) throws FLException {

		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		if (userInfoPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		userInfoDao.update(userInfoPO);
	}

	private UserVO convertBean(UserPO userPO) throws FLException {

		UserVO userVO = new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO());

		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

		if (userPO.getDuty() != null) {
			BeanUtil.copyProperties(userPO.getDuty(), userVO.getDuty(), Arrays.asList("departmentType"));
		}

		if (userPO.getDuty().getDepartmentType() != null) {
			userVO.getDuty().setDepartmentType(new DepartmentTypeVO());
			BeanUtil.copyProperties(userPO.getDuty().getDepartmentType(), userVO.getDuty().getDepartmentType());
		}

		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole());

		BeanUtil.copyProperties(userPO.getDept(), userVO.getDept(), Arrays.asList("fatherDept", "type", "manager"));

		if (userPO.getDept().getFatherDept() != null) {
			userVO.getDept().setFatherDept(new DepartmentVO());

			BeanUtil.copyProperties(userPO.getDept().getFatherDept(), userVO.getDept().getFatherDept(), Arrays.asList("fatherDept", "type", "manager"));
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

		BeanUtil.copyProperties(userPO.getDept(), userBaseVO.getDept(), Arrays.asList("fatherDept", "type", "manager"));

		return userBaseVO;
	}

}
