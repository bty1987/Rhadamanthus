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
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityCodeHelper.SecurityCodeLevel;
import com.fanglin.core.vo.Filter;
import com.fanglin.fadada.signature.Signature;
import com.fanglin.information.po.MessagePO;
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserEducationDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserOperationDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.DutmentPO;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.personel.po.UserEducationPO;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserOperationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
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
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.ModuleVO;
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
	private DepartmentDao departmentDao;

	@Autowired
	private DutyDao dutyDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private UserCompanyDao userCompanyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Autowired
	private DutmentDao dutmentDao;

	@Autowired
	private UserInfoDao userExperienceDao;

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
			userVO.setIdentity(SensitiveDataHelper.decrypt(userInfoPO.getUser().getIdentity()));
			userInfoVO.setUser(userVO);

			if (userInfoPO.getFangliner() != null) {
				userInfoVO.setFangliner(convertBean(userInfoPO.getFangliner()));
			}

			userInfoVOs.add(userInfoVO);
		}

		paging.setData(userInfoVOs);
	}

	@Override
	public void pageUserByMid(Paging paging, List<Filter> filters, ModuleVO moduleVO, Integer company) throws FLException {

		List<UserPO> userPOs = userDao.pageUserByMid(paging, filters, moduleVO.getMid(), company);
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
		userVO.setCompanyNo(CompanyServiceImpl.encode(companyPO.getCid()));

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
		userInfoVO.getUser().setIdentity(SensitiveDataHelper.decrypt(userInfoPO.getUser().getIdentity()));

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

		UserPO userPO = userInfoPO.getUser();

		userInfoVO.setUser(convertBean(userPO));

		if (userInfoPO.getFangliner() != null) {
			userInfoVO.setFangliner(convertBean(userInfoPO.getFangliner()));
		}

		try {
			userInfoVO.getUser().setCompanys(AESHelper.encrypt(FormatUtil.encodeCompany(userPO.getCompany()), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
		} catch (Exception e) {
			throw new FLException(230015, "公司不存在");
		}

		userInfoVO.getUser().setIdentity(SensitiveDataHelper.decrypt(userPO.getIdentity()));

		SystemConfigPO defaultPassword = systemConfigDao.querySystemConfig("password", userPO.getCompany());

		if (userPO.getPassword().equals(MD5Helper.MD5(defaultPassword == null ? "helloworld" : defaultPassword.getValue())) && userPO.getIsLogin() != UserPO.ISLOGIN_NOT_INT) {
			userInfoVO.getUser().setPassword("resetPassword");
		}

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
	public List<UserBaseVO> queryUserByPinyin(String pinyinName, UserVO userVO, DepartmentTypeVO departmentType, Integer company) throws FLException {
		return queryUserByPinyin(pinyinName, userVO, departmentType, company, false);
	}

	@Override
	public List<UserBaseVO> queryUserByPinyin(String pinyinName, UserVO userVO, DepartmentTypeVO departmentType, Integer company, Boolean all) throws FLException {

		CompanyPO companyPO = null;

		if (company != null) {
			companyPO = companyDao.get(company);
		}

		if (SystemConfig.getInt("multicompany", 0) == 0 && all) {
			company = null;
		}

		List<UserBaseVO> userBaseVOs = new ArrayList<UserBaseVO>();

		Paging paging = new Paging(0, 10);

		if (userVO.getStatus() == null) {
			userVO.setStatus(UserPO.STATUS_ONJOB_INT);
		}

		int dtid = 0;

		if (departmentType != null && departmentType.getName() != null && departmentType.getName().length() != 0) {
			dtid = departmentTypeDao.queryDepartmentTypeByName(departmentType.getName()).getDtid();
		}

		Integer did = null;

		if (userVO.getDept() != null && userVO.getDept().getDid() != null) {
			did = userVO.getDept().getDid();
		}

		Integer rid = null;

		if (userVO.getDept() != null && userVO.getDept().getFatherDept() != null && userVO.getDept().getFatherDept().getDid() != null) {
			rid = userVO.getDept().getFatherDept().getDid();
		}

		List<UserPO> userPOs = userDao.pageUserByPinyin(paging, pinyinName, userVO.getStatus(), company, dtid, did, rid);

		for (UserPO userPO : userPOs) {
			userBaseVOs.add(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentVO())).ptv(userPO, companyPO.getName()));
		}

		return userBaseVOs;
	}

	@Override
	public UserVO validateUser(String loginId, String password) throws FLException {

		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;

		if (userPO == null) return userVO;

		if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) return userVO;

		if (!userPO.getPassword().equals(MD5Helper.MD5(password)) && !userPO.getPassword().toUpperCase().equals(password.toUpperCase())) return userVO;

		userVO = new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO());

		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole(), Arrays.asList("creater"));

		SystemConfigPO defaultPassword = systemConfigDao.querySystemConfig("password", userPO.getCompany());

		if (userPO.getPassword().equals(MD5Helper.MD5(defaultPassword == null ? "helloworld" : defaultPassword.getValue())) && userPO.getIsLogin() != UserPO.ISLOGIN_NOT_INT) {
			userVO.setPassword("resetPassword");
		}

		userVO.setCompanys(String.valueOf(userPO.getCompany()));

		return userVO;
	}

	@Override
	public UserVO validateUserByChallenge(String loginId, String responseHash, String nonce) throws FLException {

		// 1. 查询用户
		UserPO userPO = userDao.queryUserByLoginId(loginId);
		UserVO userVO = null;

		if (userPO == null) return userVO;

		if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) return userVO;

		// 2. 获取数据库中存储的MD5密码
		String storedMD5 = userPO.getPassword();

		// 3. 服务器端计算期望的响应哈希：MD5(stored_MD5 + nonce)
		String expectedHash = MD5Helper.MD5(storedMD5 + nonce);

		// 4. 对比客户端发送的哈希和服务器计算的哈希
		if (!expectedHash.equalsIgnoreCase(responseHash)) {
			return userVO; // 验证失败
		}

		// 5. 验证成功，构建返回对象（与原validateUser方法相同）
		userVO = new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO());

		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole(), Arrays.asList("creater"));

		SystemConfigPO defaultPassword = systemConfigDao.querySystemConfig("password", userPO.getCompany());

		if (userPO.getPassword().equals(MD5Helper.MD5(defaultPassword == null ? "helloworld" : defaultPassword.getValue())) && userPO.getIsLogin() != UserPO.ISLOGIN_NOT_INT) {
			userVO.setPassword("resetPassword");
		}

		userVO.setCompanys(String.valueOf(userPO.getCompany()));

		return userVO;
	}

	@Override
	public List<UserBaseVO> queryUserByUids(List<Integer> uids) throws FLException {

		List<UserBaseVO> userBaseVOs = new ArrayList<UserBaseVO>();

		List<UserPO> userPOs = userDao.queryUserByUids(uids);

		for (UserPO userPO : userPOs) {
			userBaseVOs.add(new UserBaseVO(new DutyVO(), new DepartmentVO()).ptv(userPO));
		}

		return userBaseVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addUser(UserInfoVO userInfoVO, List<UserContractVO> userContractVOs, List<UserEducationVO> userEducationVOs, List<UserOperationVO> userOperationVOs, int company, String userId) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("userlimit", company);

		if (userDao.countUserByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
			throw new FLException(190008, "人员数已达上限, 公司上限");
		}

		UserVO userVO = userInfoVO.getUser();
		List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(userVO.getPhone(), userVO.getIdentity());

		if (userPOs.size() > 0) {
			throw new FLException(190006, "人员已存在");
		}

		UserPO userPO = userDao.queryUserByLoginId(userVO.getLoginId());

		if (userPO != null) {
			throw new FLException(190013, "登录名已存在");
		}

		DepartmentPO departmentPO = departmentDao.get(userVO.getDept().getDid());

		if (departmentPO == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		if (departmentPO.getIsdet() == DepartmentPO.ISDET_DETMENT_INT && departmentPO.getLimit() < userDao.countUserByDeptId(departmentPO.getDid())) {
			throw new FLException(190011, "人员数量已达上限, 部门上限");
		}

		DutmentPO dutmentPO = dutmentDao.queryDutmentByDids(userInfoVO.getUser().getDept().getDid(), userInfoVO.getUser().getDuty().getDid());

		if (departmentPO.getIsdet() == DepartmentPO.ISDET_DETMENT_INT && dutmentPO != null) {

			if (dutmentPO.getNum() >= dutmentPO.getLimit()) {
				throw new FLException(190011, "人员数量已达上限, 定岗上限");
			}

			dutmentPO.setNum(dutmentPO.getNum() + 1);

			dutmentDao.update(dutmentPO);
		}

		SystemConfigPO visitor = systemConfigDao.querySystemConfig("visitor"); // 游客角色ID

		if (visitor == null) {
			throw new FLException(230010, "角色不存在");
		}

		userPO = new UserPO();

		SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_USER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer _userId = new StringBuffer();
		_userId.append(SystemConfig.getInt("multicompany", 0) != 0 ? String.format("%sU-", companyPO.getShortname()) : "FL-");
		_userId.append(FormatUtil.fillZero(count, "00000"));

		userPO.setUserId(_userId.toString());

		userPO.setGender(String.valueOf(userInfoVO.getGender()).equals("0") ? "女" : "男");
		userPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));
		userPO.setLoginId(userVO.getLoginId());

		RolePO rolePO = new RolePO(Integer.valueOf(visitor.getValue()));
		userPO.setRole(rolePO);

		userPO.setIsLogin(UserPO.ISLOGIN_NOT_INT);
		userPO.setExtranet((short) (UserPO.EXTRANET_QCODE_INT + UserPO.EXTRANET_WEB_INT + UserPO.EXTRANET_PC_INT));
		userPO.setType(UserPO.TYPE_USER_INT);
		userPO.setCompany(company);

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet", "phone", "identity"));
		userPO.setPhone(SensitiveDataHelper.encrypt(userVO.getPhone()));
		userPO.setIdentity(SensitiveDataHelper.encrypt(userVO.getIdentity()));

		userPO.setDept(departmentPO);

		userPO.setDuty(dutyDao.get(userVO.getDuty().getDid()));

		userPO.setPinYin(PinYin4Util.getPinyin(userVO.getCurrentName()).get(0));

		userPO.setIsUpdate(UserPO.ISUPDATE_ADD_INT);

		userDao.save(userPO);

		UserPO operator = userDao.queryUserByUserId(userId);

		userRoleDao.save(new UserRolePO(userPO.getUid(), userPO.getRole(), operator));

		userVO.setUid(userPO.getUid());

		UserInfoPO userInfoPO = new UserInfoPO();

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user", "fangliner"));

		if (userInfoVO.getFangliner().getUserId() != null) {
			UserPO fangliner = userDao.queryUserByUserId(userInfoVO.getFangliner().getUserId());
			userInfoPO.setFangliner(fangliner);
		}

		userInfoPO.setUser(userPO);
		userInfoPO.setHireTime(DateUtil.getDateToTimestamp(new Date()));

		userInfoDao.save(userInfoPO);

		UserExperiencePO userExperiencePO = new UserExperiencePO();

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("入职");
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperateTime(userVO.getOperateTime() != null ? userVO.getOperateTime() : DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setComment(String.format("公司:%s, 部门:%s, 职位:%s. ", companyPO.getName(), userPO.getDept().getName(), dutyDao.get(userPO.getDuty().getDid()).getName()));
		userExperiencePO.setOperator(operator);

		userExperiencePO.setTcid(companyPO.getCid());
		userExperiencePO.setTdid(userPO.getDept().getDid());
		userExperiencePO.setTrid(rolePO.getRid());

		userExperienceDao.save(userExperiencePO);

		if (userContractVOs != null && userContractVOs.size() != 0) {

			for (UserContractVO userContractVO : userContractVOs) {
				UserContractPO usercontract = new UserContractPO();

				String currentDate = DateUtil.current("yyMMdd").toString();
				int count1 = countingService.queryCountingByTypeDate(CountingPO.TYPE_CONTRACT_USER_INT, currentDate, company);
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

		userInfoVO.getUser().ptv(userInfoPO.getUser());

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUser(UserInfoVO userInfoVO, int company, String userId) throws FLException {

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

		CompanyPO companyPO = companyDao.get(userPO.getCompany());
		RolePO rolePO = null;
		if (userPO.getRole() != null) {
			rolePO = roleDao.get(userPO.getRole().getRid());
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

		userPO.setDuty(dutyDao.get(userVO.getDuty().getDid()));

		List<String> pinyins = PinYin4Util.getPinyin(userVO.getCurrentName());

		userPO.setPinYin(pinyins.get(0));

		if (userPO.getIsUpdate() == UserPO.ISUPDATE_INIT_INT) {
			userPO.setIsUpdate(UserPO.ISUPDATE_UPDATE_INT);
		}

		userDao.update(userPO);

		userDao.flush();

		if (newstatus != oldstatus || newdept.getDid() != olddept.getDid() || oldduty.getDid() != newduty.getDid()) {

			if (newstatus == UserPO.STATUS_ONJOB_INT) {
				userPO.setExtranet((short) (UserPO.EXTRANET_QCODE_INT + UserPO.EXTRANET_WEB_INT + UserPO.EXTRANET_PC_INT));
			} else {
				userPO.setIsLogin(UserPO.ISLOGIN_NOT_INT);
				userPO.setExtranet(UserPO.EXTRANET_NONE_INT);

				userRoleDao.deleteUserRole(userPO.getUid());
				userCompanyDao.deleteUserCompany(userPO.getUid());
			}

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

			UserPO operator = userDao.queryUserByUserId(userId);

			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType((newstatus == oldstatus) ? "调职" : newstatus == UserPO.STATUS_ONJOB_INT ? "入职" : "离职");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setOperateTime(userVO.getOperateTime() != null ? userVO.getOperateTime() : DateUtil.getDateToTimestamp(new Date()));

			userExperiencePO.setComment(String.format("原部:%s,原职:%s,现部:%s,现职:%s", olddept.getName(), oldduty.getName(), newdept.getName(), newduty.getName()));
			userExperiencePO.setOperator(operator);
			if (companyPO != null) {
				userExperiencePO.setOcid(companyPO.getCid());
				userExperiencePO.setTcid(companyPO.getCid());
			}
			userExperiencePO.setOdid(olddept.getDid());
			userExperiencePO.setTdid(newdept.getDid());
			if (rolePO != null) {
				userExperiencePO.setOrid(rolePO.getRid());
				userExperiencePO.setTrid(rolePO.getRid());
			}

			userExperienceDao.save(userExperiencePO);
		}

		userInfoVO.getUser().ptv(userInfoPO.getUser());

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

		userPO.setPhone(SensitiveDataHelper.encrypt(userVO.getPhone()));
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

			userPO.setIsLogin(userVO.getIsLogin());

			userDao.update(userPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateUserForAdvance(UserVO userVO, int rid, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		Short isLogin = userVO.getIsLogin();
		if (isLogin != null) {
			userPO.setIsLogin(userVO.getIsLogin());
		}

		Short extranet = userVO.getExtranet();
		if (extranet != null) {
			userPO.setExtranet(userVO.getExtranet());
		}

		RolePO roleCO = roleDao.get(rid);

		if (roleCO == null) {
			throw new FLException(230010, "角色不存在");
		}

		RolePO oldRolePO = userPO.getRole();
		RolePO newRolePO = null;
		if (userVO.getRole() != null && userVO.getRole().getRid() != null) {

			newRolePO = roleDao.get(userVO.getRole().getRid());

			if (newRolePO == null) {
				throw new FLException(230010, "目标角色不存在");
			}

			if (roleCO.getRid() == newRolePO.getRid()) {
				throw new FLException(-1, "无操作权限");
			}

			if (roleCO.getLevel() <= newRolePO.getLevel()) {
				throw new FLException(-1, "无操作权限");
			}

			userPO.setRole(newRolePO);
		}

		CompanyPO newCompanyPO = null;
		CompanyPO oldCompanyPO = companyDao.get(userPO.getCompany());
		if (userVO.getCompanys() != null) {
			oldCompanyPO = companyDao.get(userPO.getCompany());
			Integer newCompany = FormatUtil.decodeCompany(AESHelper.decrypt(userVO.getCompanys(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
			newCompanyPO = companyDao.get(newCompany);

			userPO.setCompany(newCompany);
		}

		DepartmentPO deptPO = userPO.getDept();

		if (oldRolePO != null && newRolePO != null && oldRolePO.getRid() != newRolePO.getRid()) {

			UserExperiencePO userExperiencePO = new UserExperiencePO();

			UserPO operator = userDao.queryUserByUserId(userId);

			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType("调角色");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setComment(String.format("原角色:%s,现角色:%s", oldRolePO.getName(), newRolePO.getName()));
			userExperiencePO.setOperator(operator);

			if (oldCompanyPO != null) {
				userExperiencePO.setOcid(oldCompanyPO.getCid());
			}
			if (newCompanyPO != null) {
				userExperiencePO.setTcid(newCompanyPO.getCid());
			}
			if (deptPO != null) {
				userExperiencePO.setOdid(deptPO.getDid());
				userExperiencePO.setTdid(deptPO.getDid());
			}
			userExperiencePO.setOrid(oldRolePO.getRid());
			userExperiencePO.setTrid(newRolePO.getRid());

			userExperienceDao.save(userExperiencePO);
		}

		if (oldCompanyPO != null && newCompanyPO != null && oldCompanyPO.getCid() != newCompanyPO.getCid()) {

			UserExperiencePO userExperiencePO = new UserExperiencePO();
			UserPO operator = userDao.queryUserByUserId(userId);
			userExperiencePO.setUid(userPO.getUid());
			userExperiencePO.setType("调公司");
			userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			userExperiencePO.setComment(String.format("原公司:%s,现公司:%s", oldCompanyPO.getName(), newCompanyPO.getName()));
			userExperiencePO.setOperator(operator);

			userExperiencePO.setOcid(oldCompanyPO.getCid());
			userExperiencePO.setTcid(newCompanyPO.getCid());
			if (deptPO != null) {
				userExperiencePO.setOdid(deptPO.getDid());
				userExperiencePO.setTdid(deptPO.getDid());
			}
			if (oldRolePO != null) {
				userExperiencePO.setOrid(oldRolePO.getRid());
			}
			if (newRolePO != null) {
				userExperiencePO.setTrid(newRolePO.getRid());
			}

			userExperienceDao.save(userExperiencePO);
		}

		userPO.setIsUpdate(UserPO.ISUPDATE_UPDATE_INT);

		userDao.update(userPO);
	}

	@Override
	@Transactional
	public void checkUserForPassword(String userId, String password, String rePassword) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		if (userPO.getPassword() == null || password == null || rePassword == null) {
			throw new FLException(190001, "旧密码输入错误");
		}

		if (!userPO.getPassword().equals(MD5Helper.MD5(password)) && !userPO.getPassword().toUpperCase().equals(password.toUpperCase())) {
			throw new FLException(190001, "旧密码输入错误");
		}

		userPO.setPassword(rePassword.toUpperCase());

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

		BeanUtil.copyProperties(userPO, userVO, Arrays.asList("role", "dept", "duty", "password", "company", "phone", "identity"));
		userVO.setPhone(SensitiveDataHelper.decrypt(userPO.getPhone()));
		userVO.setIdentity(SensitiveDataHelper.decrypt(userPO.getIdentity()));

		if (userPO.getDuty() != null) {
			BeanUtil.copyProperties(userPO.getDuty(), userVO.getDuty(), Arrays.asList("departmentType"));
		}

		if (userPO.getDuty().getDepartmentType() != null) {
			userVO.getDuty().setDepartmentType(new DepartmentTypeVO());
			BeanUtil.copyProperties(userPO.getDuty().getDepartmentType(), userVO.getDuty().getDepartmentType());
		}

		BeanUtil.copyProperties(userPO.getRole(), userVO.getRole(), Arrays.asList("creater"));

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void quitUser(UserVO userVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (userPO.getStatus() == UserPO.STATUS_OFFJOB_INT) {
			return;
		}

		SystemConfigPO visitor = systemConfigDao.querySystemConfig("visitor");

		if (visitor == null) {
			throw new FLException(230010, "角色不存在");
		}

		UserExperiencePO userExperiencePO = new UserExperiencePO();
		CompanyPO companyPO = companyDao.get(userPO.getCompany());
		if (companyPO != null) {
			userExperiencePO.setOcid(companyPO.getCid());
			userExperiencePO.setTcid(companyPO.getCid());
		}
		DepartmentPO deptPO = userPO.getDept();
		if (deptPO != null) {
			userExperiencePO.setOdid(deptPO.getDid());
			userExperiencePO.setTdid(deptPO.getDid());
		}
		RolePO rolePO = userPO.getRole();
		if (rolePO != null) {
			userExperiencePO.setOrid(rolePO.getRid());
		}
		RolePO newRolePO = new RolePO(Integer.valueOf(visitor.getValue()));
		userExperiencePO.setTrid(newRolePO.getRid());

		userPO.setStatus(UserPO.STATUS_OFFJOB_INT);
		userPO.setRole(newRolePO);

		userRoleDao.deleteUserRole(userPO.getUid());
		userCompanyDao.deleteUserCompany(userPO.getUid());

		userPO.setIsLogin(UserPO.ISLOGIN_NOT_INT);
		userPO.setExtranet(UserPO.EXTRANET_NONE_INT);

		UserPO operator = userDao.queryUserByUserId(userId);

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("离职");
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperateTime(userVO.getOperateTime() != null ? userVO.getOperateTime() : DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperator(operator);
		userExperiencePO.setComment(String.format("原司: %s, 原部: %s, 原职: %s", companyPO.getName(), userPO.getDept().getName(), userPO.getDuty().getName()));

		userExperienceDao.save(userExperiencePO);

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		userInfoPO.setFireTime(DateUtil.getDateToTimestamp(new Date()));

		userInfoDao.update(userInfoPO);

		userDao.update(userPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void tranUser(UserVO userVO, String userId, int roleId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		UserPO operator = userDao.queryUserByUserId(userId);

		StringBuffer comment = new StringBuffer();

		DepartmentPO newdept = null;
		DepartmentPO olddept = userPO.getDept();

		if (userVO.getDept() != null && userVO.getDept().getDid() != null) {

			newdept = departmentDao.get(userVO.getDept().getDid());

			if (newdept == null) {
				throw new FLException(310001, "部门不存在");
			}

			if (newdept.getFatherDept() == null) {
				throw new FLException(310002, "部门不可添加人员");
			}
		}

		if (newdept != null && olddept.getDid() != newdept.getDid()) {

			userPO.setDept(newdept);

			comment.append(String.format("原部: %s, 现部: %s. ", olddept.getName(), newdept.getName()));
		}

		DutyPO newduty = null;
		DutyPO oldduty = userPO.getDuty();

		if (userVO.getDuty() != null && userVO.getDuty().getDid() != null) {

			newduty = dutyDao.get(userVO.getDuty().getDid());

			if (newdept == null) {
				throw new FLException(130015, "职位不存在");
			}
		}

		if (newduty != null && oldduty.getDid() != newduty.getDid()) {

			userPO.setDuty(newduty);

			comment.append(String.format("原职: %s, 现职: %s. ", oldduty.getName(), newduty.getName()));
		}

		RolePO newrole = null;
		RolePO oldrole = userPO.getRole();

		if (userVO.getRole() != null && userVO.getRole().getRid() != null) {

			newrole = roleDao.get(userVO.getRole().getRid());

			if (newrole == null) {
				throw new FLException(230010, "角色不存在");
			}
		}

		if (userVO.getRole() != null && userVO.getRole().getRid() != null) {

			RolePO roleCO = roleDao.get(roleId);

			if (roleCO == null) {
				throw new FLException(230010, "角色不存在");
			}

			if (roleCO.getRid() == newrole.getRid()) {
				throw new FLException(-1, "无操作权限");
			}

			if (roleCO.getLevel() <= newrole.getLevel()) {
				throw new FLException(-1, "无操作权限");
			}
		}

		if (newrole != null && oldrole.getRid() != newrole.getRid()) {

			userPO.setRole(newrole);

			comment.append(String.format("原角色:%s, 现角色:%s. ", oldrole.getName(), newrole.getName()));
		}

		CompanyPO newcompany = null;
		CompanyPO oldcompany = companyDao.get(userPO.getCompany());

		if (userVO.getCompanys() != null && !"".equals(userVO.getCompanys())) {

			newcompany = companyDao.get(CompanyServiceImpl.decode(userVO.getCompanys()));
		}

		if (newcompany != null && oldcompany.getCid() != newcompany.getCid()) {

			userPO.setCompany(newcompany.getCid());

			comment.append(String.format("原司:%s, 现司:%s. ", oldcompany.getName(), newcompany.getName()));
		}

		UserExperiencePO userExperiencePO = new UserExperiencePO();

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("调职");
		userExperiencePO.setIsPrefor(userVO.getIsPrefor());
		userExperiencePO.setOperator(operator);
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperateTime(userVO.getOperateTime() != null ? userVO.getOperateTime() : DateUtil.getDateToTimestamp(new Date()));

		userExperiencePO.setComment(comment.toString());

		if (oldcompany != null) {
			userExperiencePO.setOcid(oldcompany.getCid());
		}
		if (newcompany != null) {
			userExperiencePO.setTcid(newcompany.getCid());
		}
		if (olddept != null) {
			userExperiencePO.setOdid(olddept.getDid());
		}
		if (newdept != null) {
			userExperiencePO.setTdid(newdept.getDid());
		}
		if (oldrole != null) {
			userExperiencePO.setOrid(oldrole.getRid());
		}
		if (newrole != null) {
			userExperiencePO.setTrid(newrole.getRid());
		}

		userExperienceDao.save(userExperiencePO);

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		userInfoPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));

		userInfoDao.update(userInfoPO);

		userDao.update(userPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int registUser(UserVO userVO) throws FLException {

		UserPO userPO = userDao.get(userVO.getUid());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (userPO.getAuthStatus() != UserPO.AUTH_STATUS_INIT_INT) {
			throw new FLException(190014, "人员状态不可操作");
		}

		if (userPO.getSignNo() == null || "".equals(userPO.getSignNo())) {
			userPO.setSignNo(Signature.register(FormatUtil.fillZero(userPO.getUid(), "00000000")));
		}

		userDao.update(userPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetUser(UserVO userVO) throws FLException {

		UserPO userPO = userDao.get(userVO.getUid());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (userPO.getAuthStatus() != UserPO.AUTH_STATUS_INIT_INT) {
			throw new FLException(190014, "人员状态不可操作");
		}

		userPO.setToken(null);
		userPO.setSignNo(null);

		userDao.update(userPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String authUser(UserVO userVO) throws FLException {

		UserPO userPO = userDao.get(userVO.getUid());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (userPO.getAuthStatus() != UserPO.AUTH_STATUS_INIT_INT) {
			throw new FLException(190014, "人员状态不可操作");
		}

		String redirect = "";

		if (userPO.getAuthUrl() != null && !"".equals(userPO.getAuthUrl())) {
			redirect = userPO.getAuthUrl();
		}

		Short type = 0;

		JSONObject info = Signature.authenticate(userPO.getSignNo(), userPO.getUserName(), userPO.getPhone(), userPO.getIdentity(), type);

		redirect = Signature.decode(info.getString("url"));

		userPO.setToken(info.getString("transactionNo"));

		userDao.update(userPO);

		return redirect;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmUser(UserVO userVO) throws FLException {

		UserPO userPO = userDao.get(userVO.getUid());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (userPO.getAuthStatus() != UserPO.AUTH_STATUS_INIT_INT) {
			throw new FLException(190014, "人员状态不可操作");
		}

		JSONObject info = Signature.person(userPO.getToken());

		JSONObject person = info.getJSONObject("person");

		userPO.setUserName(person.getString("personName"));
		userPO.setIdentity(SensitiveDataHelper.encrypt(person.getString("idCard")));
		userPO.setPhone(SensitiveDataHelper.encrypt(person.getString("mobile")));

		userPO.setUserPhoto(person.getString("photoUuid"));
		userPO.setIdentityPathF(person.getString("headPhotoPath"));
		userPO.setIdentityPathB(person.getString("backgroundIdCardPath"));

		userPO.setAuthStatus(UserPO.AUTH_STATUS_AUTH_INT);

		userDao.update(userPO);

		userVO.setUserName(userPO.getUserName());
		userVO.setGender(userPO.getGender());
		userVO.setPhone(SensitiveDataHelper.decrypt(userPO.getPhone()));
		userVO.setIdentity(SensitiveDataHelper.decrypt(userPO.getIdentity()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int signateUser(UserVO userVO, String imgbase) throws FLException {

		UserPO userPO = userDao.get(userVO.getUid());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		Signature.signature(userPO.getSignNo(), imgbase);

		userDao.update(userPO);

		return 0;
	}

}
