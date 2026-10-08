/**
 * @File Name		: ApprovalServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.seiya.service.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.construction.dao.AcceptanceDao;
import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.dao.ConstructionCostDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionCostPO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.service.SurveyService;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.service.ConstructionNodeService;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.DutmentPO;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.seiya.service.A20251208Service;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("A20251208Service")
@Transactional(readOnly = true)
public class A20251208ServiceImpl implements A20251208Service {

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
	private CountingService countingService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DutmentDao dutmentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private ConstructionNodeService constructionNodeService;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private SurveyService surveyService;

	@Autowired
	private ConstructionScheduleService constructionScheduleService;

	@Autowired
	private ConstructionService constructionService;

	@Autowired
	private MessageService messageService;

	@Autowired
	private ConstructerDao constructerDao;

	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Autowired
	private UserInfoDao userExperienceDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private UserCompanyDao userCompanyDao;

	@Autowired
	private AcceptanceDao acceptanceDao;

	@Autowired
	private ConstructionCostDao constructionCostDao;

	@Autowired
	private RoleDao roleDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveOrUpdateUserForPlatforPm(UserInfoVO userInfoVO, String userId) throws FLException {

		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		int company = 73;

		if (userInfoPO == null) {
			addUser(userInfoVO, company, userId);
		} else {
			updateUser(userInfoVO, company, userId);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addUser(UserInfoVO userInfoVO, int company, String userId) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("userlimit", company);

		if (userDao.countUserByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
			// throw new FLException(190035, "人员数已达上限, 公司上限");
		}

		UserVO userVO = userInfoVO.getUser();

		List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(userVO.getPhone(), userVO.getIdentity());

		if (userPOs.size() > 0) {
			// throw new FLException(190006, "人员已存在");
			userInfoVO.getUser().ptv(userPOs.get(0));
			userVO.setUid(userPOs.get(0).getUid());
			return;
		}

		UserPO userPO = userDao.queryUserByLoginId(userVO.getLoginId());

		if (userPO != null) {
			throw new FLException(190013, "登录名已存在");
		}

		// 邮箱查重(190039): 空值=清空邮箱放行,重复邮箱致企业大学唯一性冲突
		if (userInfoVO.getEmail() != null && !userInfoVO.getEmail().trim().isEmpty() && userInfoDao.countUserInfoByEmail(userInfoVO.getEmail().trim(), null) > 0) {
			throw new FLException(190039, "邮箱已被占用");
		}

		DepartmentPO departmentPO = departmentDao.get(userVO.getDept().getDid());

		if (departmentPO == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		if (departmentPO.getIsdet() == DepartmentPO.ISDET_DETMENT_INT && departmentPO.getLimit() < userDao.countUserByDeptId(departmentPO.getDid())) {
			throw new FLException(190037, "人员数量已达上限, 部门上限");
		}

		DutmentPO dutmentPO = dutmentDao.queryDutmentByDids(userInfoVO.getUser().getDept().getDid(), userInfoVO.getUser().getDuty().getDid());

		if (departmentPO.getIsdet() == DepartmentPO.ISDET_DETMENT_INT && dutmentPO != null) {

			if (dutmentPO.getNum() >= dutmentPO.getLimit()) {
				throw new FLException(190038, "人员数量已达上限, 定岗上限");
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

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		userPO.setDept(departmentPO);

		userPO.setDuty(dutyDao.get(userVO.getDuty().getDid()));

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

		userInfoPO.setUser(userPO);
		userInfoPO.setHireTime(DateUtil.getDateToTimestamp(new Date()));

		userInfoDao.save(userInfoPO);

		UserExperiencePO userExperiencePO = new UserExperiencePO();

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("入职");
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperateTime(userVO.getOperateTime() != null ? userVO.getOperateTime() : DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setComment(String.format("公司:%s, 部门:%s, 职位:%s. ", companyPO.getName(), userPO.getDept().getName(), dutyDao.get(userPO.getDuty().getDid()).getName()));

		userExperiencePO.setTcid(companyPO.getCid());
		userExperiencePO.setTdid(userPO.getDept().getDid());
		userExperiencePO.setTrid(rolePO.getRid());

		userExperienceDao.save(userExperiencePO);

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

		// 邮箱查重(190039): 排除本人;空值=清空邮箱放行
		if (userInfoVO.getEmail() != null && !userInfoVO.getEmail().trim().isEmpty() && userInfoDao.countUserInfoByEmail(userInfoVO.getEmail().trim(), userVO.getUserId()) > 0) {
			throw new FLException(190039, "邮箱已被占用");
		}

		UserPO userPO = userInfoPO.getUser();

		DepartmentPO departmentPO = departmentDao.get(userVO.getDept().getDid());

		if (departmentPO == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

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

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

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
	public void tranUserForPlatforPm(UserVO userVO, String userId) throws FLException {

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

		UserExperiencePO userExperiencePO = new UserExperiencePO();

		userExperiencePO.setUid(userPO.getUid());
		userExperiencePO.setType("调职");
		userExperiencePO.setIsPrefor(userVO.getIsPrefor());
		userExperiencePO.setOperator(operator);
		userExperiencePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userExperiencePO.setOperateTime(userVO.getOperateTime() != null ? userVO.getOperateTime() : DateUtil.getDateToTimestamp(new Date()));

		userExperiencePO.setComment(comment.toString());

		if (olddept != null) {
			userExperiencePO.setOdid(olddept.getDid());
		}
		if (newdept != null) {
			userExperiencePO.setTdid(newdept.getDid());
		}

		userExperienceDao.save(userExperiencePO);

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		userInfoPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));

		userInfoDao.update(userInfoPO);

		userDao.update(userPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void quitUserForPlatforPm(UserVO userVO, String userId) throws FLException {

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
	public int beginConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = null;

		if (constructionScheduleVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());
		} else {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionScheduleVO.getCnid());

			if (constructionSchedulePO == null) {
				throw new FLException(120024, "工程环节不存在");
			}

			constructionScheduleVO.setCsid(constructionSchedulePO.getCsid());
		}

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		DecorationPO decorationPO = constructionPO.getDecoration();

		ConstructionNodePO constructionNodePO = constructionSchedulePO.getNode();

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < Arith.div(constructionSchedulePO.getPrecheck(), 1000.0)) {
			throw new FLException(120018, "装修款比例不足");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getSaleScale() < Arith.div(constructionSchedulePO.getStacheck(), 1000.0)) {
			throw new FLException(120033, "销售比例不足");
		}

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_BEGIN_INT);
		constructionSchedulePO.setStartTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);

		if (constructionNodePO.getStartSurvey() != null && constructionNodePO.getStartSurvey().getStatus() == ConstructionNodePO.STATUS_INIT_SHORT) {
			surveyService.makeSurvey(new SurveyVO(constructionNodePO.getStartSurvey().getStid(), constructionPO.getDecoration().getOrderId()), userId, constructionPO.getDecoration().getCompany());
		}

		ConstructionNodePO projectStatus = constructionNodeDao.get(decorationPO.getProjectStatus());

		if (projectStatus != null && projectStatus.getSort() < constructionNodePO.getSort() && projectStatus.getSort() != DecorationPO.PROJECTSTATUS_FINISH_INT) {

			decorationPO.setProjectStatus(constructionSchedulePO.getNode().getCnid());

			decorationDao.update(decorationPO);

			constructionPO.setSchedule(constructionNodePO.getSort());
			constructionPO.setCnid(constructionNodePO.getCnid());
		}

		if (constructionNodePO.getMark() == ConstructionNodePO.MARK_START_INT) {
			constructionPO.setStartTime(DateUtil.getDateToTimestamp(new Date()));

			constructionScheduleService.resetConstructionSchedule(constructionScheduleVO);
		}

		constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		constructionDao.update(constructionPO);

		decorationService.sendMessage(decorationPO.getOrderId(), "工程", String.format("%s准备进场. %s", constructionNodePO.getName(), constructionNodePO.getStartalk()));

		constructionScheduleVO.setStartTime(constructionSchedulePO.getStartTime());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = null;

		if (constructionScheduleVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());
		} else {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionScheduleVO.getCnid());
		}

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_BEGIN_INT && constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_SALARY_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		DecorationPO decorationPO = constructionPO.getDecoration();

		ConstructionNodePO constructionNodePO = constructionSchedulePO.getNode();

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < Arith.div(constructionSchedulePO.getPostcheck(), 1000.0)) {
			throw new FLException(120018, "装修款比例不足");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getSaleScale() < Arith.div(constructionSchedulePO.getFincheck(), 1000.0)) {
			throw new FLException(120033, "销售比例不足");
		}

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_FINISH_INT);
		constructionSchedulePO.setEndTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);

		if (constructionNodePO.getProcess() != ConstructionNodePO.PROCESS_INIT_INT && constructionScheduleDao.countConstructionSchedule(constructionPO.getCid(), ConstructionSchedulePO.STATUS_FINISH_INT, constructionNodePO.getProcess()) + 1 == constructionNodeDao.countConstructionNode(constructionNodePO.getProcess(), decorationPO.getCompany())) {
			constructionPO.setProcess(constructionNodePO.getProcess());
			constructionPO.setProcessTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (constructionNodePO.getMark() == ConstructionNodePO.MARK_FINISH_INT) {
			constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionDao.update(constructionPO);

		if (constructionNodePO.getEndSurvey() != null && constructionNodePO.getEndSurvey().getStatus() == ConstructionNodePO.STATUS_INIT_SHORT) {
			surveyService.makeSurvey(new SurveyVO(constructionNodePO.getEndSurvey().getStid(), constructionPO.getDecoration().getOrderId()), userId, constructionPO.getDecoration().getCompany());
		}

		decorationService.sendMessage(decorationPO.getOrderId(), "工程", String.format("%s已完工. %s", constructionNodePO.getName(), constructionNodePO.getEndtalk()));

		ConstructionInfoPO constructionInfo = constructionInfoDao.queryConstructionInfoByOrderId(decorationPO.getOrderId());

		long finishDay = 0;
		String finishTime = "无";

		if (constructionInfo != null && constructionInfo.getFinishTime() != null) {
			finishDay = Arith.div(DateUtil.getDateToTimestamp(constructionInfo.getFinishTime()).getTime() - System.currentTimeMillis(), 86400000000L);
			finishTime = DateUtil.getDateToDateString(DateUtil.getDateToTimestamp(constructionInfo.getFinishTime()), "yyyy年MM月dd日");
		}

		String content = String.format("装修单: %s, 地址: %s %s, 预计完工时间: %s , 还剩%s日 , 请及时对接完工安排 ", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()), finishTime, finishDay + 1);

		messageService.sendMessage(constructionPO.getSupervisor().getUserId(), decorationPO.getCreater().getUserId(), content, MessagePO.TYPE_SEND_CONSTRUCTION_INT, decorationPO.getCompany());

		constructionScheduleVO.setEndTime(constructionSchedulePO.getEndTime());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void syncConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = null;

		Long cnid = constructionScheduleVO.getCnid();

		if (cnid == null && constructionScheduleVO.getNode() != null) {
			cnid = constructionScheduleVO.getNode().getCnid();
		}

		if (constructionScheduleVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());
		}

		if (constructionSchedulePO == null && constructionScheduleVO.getCid() != null && cnid != null) {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(constructionScheduleVO.getCid(), cnid);
		}

		if (constructionSchedulePO == null && constructionScheduleVO.getOrderId() != null && cnid != null) {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), cnid);
		}

		constructionScheduleVO.setCnid(cnid);

		if (constructionSchedulePO == null) {
			constructionSchedulePO = addConstructionSchedule(constructionScheduleVO);
		}

		if (constructionScheduleVO.getPrecheck() != null) constructionSchedulePO.setPrecheck(constructionScheduleVO.getPrecheck());
		if (constructionScheduleVO.getPostcheck() != null) constructionSchedulePO.setPostcheck(constructionScheduleVO.getPostcheck());
		if (constructionScheduleVO.getStacheck() != null) constructionSchedulePO.setStacheck(constructionScheduleVO.getStacheck());
		if (constructionScheduleVO.getFincheck() != null) constructionSchedulePO.setFincheck(constructionScheduleVO.getFincheck());

		if (constructionScheduleVO.getAccessoryLimit() != null) constructionSchedulePO.setAccessoryLimit(constructionScheduleVO.getAccessoryLimit());
		if (constructionScheduleVO.getSalaryLimit() != null) {
			int salaryLimitTotal = constructionScheduleVO.getSalaryLimitTotal() == null ? constructionSchedulePO.getSalaryLimitTotal() : constructionScheduleVO.getSalaryLimitTotal();

			if (constructionScheduleVO.getSalaryLimit() > Arith.add(constructionSchedulePO.getSalaryLimit(), salaryLimitTotal)) {
				throw new FLException(120035, "工费浮动已达上限");
			}

			constructionSchedulePO.setSalaryLimit(constructionScheduleVO.getSalaryLimit());
		}
		if (constructionScheduleVO.getAccessoryTotal() != null) constructionSchedulePO.setAccessoryTotal(constructionScheduleVO.getAccessoryTotal());
		if (constructionScheduleVO.getSalaryTotal() != null) constructionSchedulePO.setSalaryTotal(constructionScheduleVO.getSalaryTotal());
		if (constructionScheduleVO.getSalaryLimitTotal() != null) constructionSchedulePO.setSalaryLimitTotal(constructionScheduleVO.getSalaryLimitTotal());
		if (constructionScheduleVO.getPeriod() != null) constructionSchedulePO.setPeriod(constructionScheduleVO.getPeriod());
		if (constructionScheduleVO.getPrenum() != null) constructionSchedulePO.setPrenum(constructionScheduleVO.getPrenum());
		if (constructionScheduleVO.getPostnum() != null) constructionSchedulePO.setPostnum(constructionScheduleVO.getPostnum());
		if (constructionScheduleVO.getPreStartTime() != null) constructionSchedulePO.setPreStartTime(constructionScheduleVO.getPreStartTime());
		if (constructionScheduleVO.getPreEndTime() != null) constructionSchedulePO.setPreEndTime(constructionScheduleVO.getPreEndTime());
		if (constructionScheduleVO.getStartTime() != null) constructionSchedulePO.setStartTime(constructionScheduleVO.getStartTime());
		if (constructionScheduleVO.getEndTime() != null) constructionSchedulePO.setEndTime(constructionScheduleVO.getEndTime());
		if (constructionScheduleVO.getStatus() != null) constructionSchedulePO.setStatus(constructionScheduleVO.getStatus());
		if (constructionScheduleVO.getCheckout() != null) constructionSchedulePO.setCheckout(constructionScheduleVO.getCheckout());
		if (constructionScheduleVO.getSchedule() != null) constructionSchedulePO.setSchedule(constructionScheduleVO.getSchedule());
		if (constructionScheduleVO.getWorkStatus() != null) constructionSchedulePO.setWorkStatus(constructionScheduleVO.getWorkStatus());
		if (constructionScheduleVO.getScheduleStatus() != null) constructionSchedulePO.setScheduleStatus(constructionScheduleVO.getScheduleStatus());

		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);

		constructionScheduleVO.setCsid(constructionSchedulePO.getCsid());
		constructionScheduleVO.setCid(constructionSchedulePO.getCid());
		constructionScheduleVO.setOrderId(constructionSchedulePO.getOrderId());
		constructionScheduleVO.setCnid(constructionSchedulePO.getNode().getCnid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void syncConstructionSchedulesForPlatforPm(List<ConstructionScheduleVO> constructionSchedules) throws FLException {

		if (constructionSchedules == null || constructionSchedules.isEmpty()) {
			return;
		}

		for (ConstructionScheduleVO constructionScheduleVO : constructionSchedules) {
			syncConstructionScheduleForPlatforPm(constructionScheduleVO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructerForPlatforPm(ConstructerVO constructerVO, String createrId) throws FLException {

		Long cid = constructerVO.getCid();
		Long csid = constructerVO.getCsid();

		ConstructionPO constructionPO = constructionDao.queryConstructionByCid(cid);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionSchedulePO constructionSchedulePO = null;

		if (csid != null) {
			constructionSchedulePO = constructionScheduleDao.get(csid);
		} else {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructerVO.getOrderId(), constructerVO.getCnid());
			csid = constructionSchedulePO.getCsid();
		}

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getStatus() == ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120026, "工程环节未开工");
		}

		UserPO userPO = userDao.queryUserByUserId(constructerVO.getUser().getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		if (constructerDao.countConstructer(cid, userPO.getUid(), csid) > 0) {
			throw new FLException(120001, "工人已添加,不可重复添加");
		}

		UserPO creater = userDao.queryUserByUserId(createrId);

		ConstructerPO constructerPO = new ConstructerPO(userPO, creater);

		BeanUtil.copyProperties(constructerVO, constructerPO, Arrays.asList("user", "creater"));

		constructerPO.setCid(cid);
		constructerPO.setCsid(csid);

		constructerPO.setOrderId(constructionPO.getDecoration().getOrderId());
		constructerPO.setCnid(constructionSchedulePO.getNode().getCnid());
		constructerPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		constructerPO.setStatus(ConstructerPO.STATUS_INIT_INT);

		constructerDao.save(constructerPO);

		constructerVO.setCid(cid);
		constructerVO.setCsid(csid);

		constructerVO.setCrid(constructerPO.getCrid());
		constructerVO.setOrderId(constructerPO.getOrderId());

		constructerVO.setCnid(constructerPO.getCnid());
		constructerVO.setUser(new UserVO().setBaseInfo(userPO));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructerForPlatforPm(ConstructerVO constructerVO) throws FLException {

		ConstructerPO constructerPO = null;

		if (constructerVO.getUser() == null || constructerVO.getUser().getUserId() == null) {
			constructerPO = constructerDao.get(constructerVO.getCrid());
		} else {
			UserPO userPO = userDao.queryUserByUserId(constructerVO.getUser().getUserId());

			if (userPO == null) {
				throw new FLException(120021, "施工人员不存在");
			}

			constructerPO = constructerDao.queryConstructerByUid(constructerVO.getOrderId(), constructerVO.getCnid(), userPO.getUid());
		}

		if (constructerPO == null) {
			throw new FLException(120021, "施工人员不存在");
		}

		if (constructerPO.getStatus() != ConstructerPO.STATUS_INIT_INT) {
			throw new FLException(120022, "施工人员状态不可操作");
		}

		Long cid = Long.valueOf(constructerPO.getCid());
		int uid = constructerPO.getUser().getUid();

		Integer workerSalaryCount = workerSalaryDao.countWorkerSalary(cid, uid);

		if (workerSalaryCount > 0) {
			throw new FLException(120023, "施工人员存在工费,不可删除");
		}

		constructerPO.setStatus(ConstructerPO.STATUS_DISABLE_INT);

		constructerDao.update(constructerPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int beginConstructionForPlatforPm(ConstructionVO constructionVO, String userId, int company) throws FLException {

		String orderId = constructionVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		long cid = constructionPO.getCid();

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionInfoPO.setCid(cid);

		constructionInfoDao.update(constructionInfoPO);

		int timelimit = 0;

		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		List<ConstructionNodePO> constructionNodes = constructionNodeDao.queryConstructionNode(company);
		for (ConstructionNodePO constructionNodePO : constructionNodes) {

			Timestamp drawlineTime = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

			int prenum = 0;
			int postnum = 0;

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit + prenum, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + prenum - 1000 + constructionNodePO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodePO.getCnid());

			if (constructionSchedulePO != null) {

				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);
				constructionSchedulePO.setPrenum(prenum);
				constructionSchedulePO.setPostnum(postnum);

				constructionSchedulePO.setPeriod(constructionNodePO.getTimeLimit());

				constructionScheduleDao.update(constructionSchedulePO);
			} else {

				constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodePO.getTimeLimit(), prenum, postnum).init(constructionNodePO);

				constructionSchedulePO.setSalaryLimitTotal(salaryLimitTotal == null ? 0 : Integer.valueOf(salaryLimitTotal.getValue()));

				constructionScheduleDao.save(constructionSchedulePO);
			}

			timelimit = timelimit + prenum + constructionNodePO.getTimeLimit() + postnum;

			constructionPO.setPreStartTime(drawlineTime);
			constructionPO.setPreEndTime(endTime);
			constructionPO.setPeriod(DateUtil.diffDay(drawlineTime, endTime));
		}

		constructionDao.update(constructionPO);

		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_INITIAL_INT) {
			decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);

			decorationDao.update(decorationPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void syncConstructionForPlatforPm(ConstructionVO constructionVO) throws FLException {

		String orderId = constructionVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			constructionPO = new ConstructionPO(decorationPO);
			constructionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			constructionPO.setStartTime(constructionVO.getStartTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionVO.getStartTime());

			if (decorationPO.getSupervisor() != null) constructionPO.setSupervisor(decorationPO.getSupervisor());

			setConstruction(constructionPO, constructionVO);
			setConstructionLimit(constructionPO, constructionVO, decorationPO);

			constructionDao.save(constructionPO);
			constructionDao.flush();
		} else {
			setConstruction(constructionPO, constructionVO);
			setConstructionLimit(constructionPO, constructionVO);

			constructionDao.update(constructionPO);
		}

		syncConstructionInfo(constructionPO, decorationPO);

		constructionVO.setCid(constructionPO.getCid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void syncSupervisorForPlatforPm(ConstructionVO constructionVO, String userId) throws FLException {

		syncConstructionForPlatforPm(constructionVO);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionVO.getSupervisor() == null || constructionVO.getSupervisor().getUserId() == null) return;

		UserPO supervisor = userDao.queryUserByUserId(constructionVO.getSupervisor().getUserId());

		if (supervisor == null) {
			throw new FLException(220005, "员工不存在");
		}

		constructionVO.setCid(constructionPO.getCid());

		constructionService.updateConstructionByOrderId(constructionVO, null, userId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAcceptanceForPlatforPm(AcceptanceVO acceptanceVO) throws FLException {

		return syncAcceptanceForPlatforPm(acceptanceVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncAcceptanceForPlatforPm(AcceptanceVO acceptanceVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(acceptanceVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		SystemConfigPO limit = systemConfigDao.querySystemConfig("CONSTRUCTION_ACCEPTANCE_LIMIT_INT", decorationPO.getCompany());

		if (decorationPO.getPaySacle() < (limit != null ? Integer.parseInt(limit.getValue()) : 80)) {
			throw new FLException(120018, "装修款比例不足");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(acceptanceVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		AcceptancePO acceptancePO = acceptanceDao.queryAcceptanceByOrderId(acceptanceVO.getOrderId());

		if (acceptancePO == null) {
			acceptancePO = new AcceptancePO();
			acceptancePO.setAcceptanceTime(DateUtil.current(AcceptancePO.CURRENT_TIME_FORMAT_STR));
		}

		if (acceptancePO.getAcceptanceTime() == null) {
			acceptancePO.setAcceptanceTime(DateUtil.current(AcceptancePO.CURRENT_TIME_FORMAT_STR));
		}

		BeanUtil.copyProperties(acceptanceVO, acceptancePO);

		acceptanceDao.saveOrUpdate(acceptancePO);

		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_FINISH_INT);

		decorationDao.update(decorationPO);

		if (constructionPO.getEndTime() == null) {
			constructionPO.setEndTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		if (constructionPO.getProcess() == ConstructionPO.PROCESS_INIT_INT) {
			constructionPO.setProcess(ConstructionPO.PROCESS_FINISH_INT);
			constructionPO.setProcessTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionDao.update(constructionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void syncConstructionNodeForPlatforPm(ConstructionNodeVO constructionNodeVO) throws FLException {

		ConstructionNodePO constructionNodePO = constructionNodeVO.getCnid() == null ? null : constructionNodeDao.get(constructionNodeVO.getCnid());

		if (constructionNodePO == null) {
			constructionNodeService.addConstructionNode(constructionNodeVO);
		} else {
			constructionNodeService.updateConstructionNode(constructionNodeVO);
		}
	}

	private ConstructionSchedulePO addConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionPO constructionPO = null;

		if (constructionScheduleVO.getCid() != null) {
			constructionPO = constructionDao.queryConstructionByCid(constructionScheduleVO.getCid());
		} else if (constructionScheduleVO.getOrderId() != null) {
			constructionPO = constructionDao.queryConstructionByOrderId(constructionScheduleVO.getOrderId());
		}

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionNodePO constructionNodePO = null;

		if (constructionScheduleVO.getNode() != null && constructionScheduleVO.getNode().getCnid() != null) {
			constructionNodePO = constructionNodeDao.get(constructionScheduleVO.getNode().getCnid());
		} else if (constructionScheduleVO.getCnid() != null) {
			constructionNodePO = constructionNodeDao.get(constructionScheduleVO.getCnid());
		}

		if (constructionNodePO == null) {
			throw new FLException(120034, "工程节点不存在");
		}

		ConstructionSchedulePO constructionSchedulePO = new ConstructionSchedulePO(constructionPO.getCid(), constructionPO.getDecoration().getOrderId()).init(constructionNodePO);

		if (constructionSchedulePO.getPeriod() == 0) constructionSchedulePO.setPeriod(constructionNodePO.getTimeLimit());

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_INIT_INT);
		constructionSchedulePO.setCheckout(ConstructionSchedulePO.CHECKOUT_VALID_INT);
		constructionSchedulePO.setWorkStatus(ConstructionSchedulePO.WORKSTATUS_INIT_INT);

		constructionScheduleDao.save(constructionSchedulePO);

		return constructionSchedulePO;
	}

	private void setConstruction(ConstructionPO constructionPO, ConstructionVO constructionVO) {

		if (constructionVO.getCnid() != null) constructionPO.setCnid(constructionVO.getCnid());
		if (constructionVO.getSchedule() != null) constructionPO.setSchedule(constructionVO.getSchedule());
		if (constructionVO.getProcess() != null) constructionPO.setProcess(constructionVO.getProcess());
		if (constructionVO.getPeriod() != null) constructionPO.setPeriod(constructionVO.getPeriod());
		if (constructionVO.getAccessory() != null) constructionPO.setAccessory(constructionVO.getAccessory());
		if (constructionVO.getAccessoryTotal() != null) constructionPO.setAccessoryTotal(constructionVO.getAccessoryTotal());
		if (constructionVO.getSalaryTotal() != null) constructionPO.setSalaryTotal(constructionVO.getSalaryTotal());
		if (constructionVO.getCreateTime() != null) constructionPO.setCreateTime(constructionVO.getCreateTime());
		if (constructionVO.getPreStartTime() != null) constructionPO.setPreStartTime(constructionVO.getPreStartTime());
		if (constructionVO.getPreEndTime() != null) constructionPO.setPreEndTime(constructionVO.getPreEndTime());
		if (constructionVO.getStartTime() != null) constructionPO.setStartTime(constructionVO.getStartTime());
		if (constructionVO.getEndTime() != null) constructionPO.setEndTime(constructionVO.getEndTime());
		if (constructionVO.getFinishTime() != null) constructionPO.setFinishTime(constructionVO.getFinishTime());
		if (constructionVO.getProcessTime() != null) constructionPO.setProcessTime(constructionVO.getProcessTime());
		if (constructionVO.getWorkStatus() != null) constructionPO.setWorkStatus(constructionVO.getWorkStatus());
		if (constructionVO.getScheduleStatus() != null) constructionPO.setScheduleStatus(constructionVO.getScheduleStatus());
		if (constructionVO.getBalanceStatus() != null) constructionPO.setBalanceStatus(constructionVO.getBalanceStatus());
		if (constructionVO.getTerminalStatus() != null) constructionPO.setTerminalStatus(constructionVO.getTerminalStatus());
	}

	private void setConstructionLimit(ConstructionPO constructionPO, ConstructionVO constructionVO, DecorationPO decorationPO) {

		if (constructionVO.getAccessoryLimit() != null) constructionPO.setAccessoryLimit(constructionVO.getAccessoryLimit());
		if (constructionVO.getSalaryLimit() != null) constructionPO.setSalaryLimit(constructionVO.getSalaryLimit());
		if (constructionVO.getSalaryLimitTotal() != null) constructionPO.setSalaryLimitTotal(constructionVO.getSalaryLimitTotal());

		if (constructionVO.getAccessoryLimit() != null && constructionVO.getSalaryLimit() != null && constructionVO.getSalaryLimitTotal() != null) return;
		if (constructionPO.getAccessoryLimit() != 0 && constructionPO.getSalaryLimit() != 0 && constructionPO.getSalaryLimitTotal() != 0) return;

		ConstructionCostPO constructionCostPO = constructionCostDao.queryConstructionCost(decorationPO.getHouse().getBuildArea(), decorationPO.getCompany());
		SystemConfigPO accessoryLimit = systemConfigDao.querySystemConfig("accessoryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimit = systemConfigDao.querySystemConfig("salaryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		if (constructionVO.getAccessoryLimit() == null && constructionPO.getAccessoryLimit() == 0) constructionPO.setAccessoryLimit(constructionCostPO == null ? (accessoryLimit == null ? ConstructionCostPO.ACCESSORY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue())) : constructionCostPO.getAccessory());
		if (constructionVO.getSalaryLimit() == null && constructionPO.getSalaryLimit() == 0) constructionPO.setSalaryLimit(constructionCostPO == null ? (salaryLimit == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimit.getValue())) : constructionCostPO.getSalary());
		if (constructionVO.getSalaryLimitTotal() == null && constructionPO.getSalaryLimitTotal() == 0) constructionPO.setSalaryLimitTotal(constructionCostPO == null ? (salaryLimitTotal == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimitTotal.getValue())) : constructionCostPO.getSalary());
	}

	private void setConstructionLimit(ConstructionPO constructionPO, ConstructionVO constructionVO) {

		if (constructionVO.getAccessoryLimit() != null) constructionPO.setAccessoryLimit(constructionVO.getAccessoryLimit());
		if (constructionVO.getSalaryLimit() != null) constructionPO.setSalaryLimit(constructionVO.getSalaryLimit());
		if (constructionVO.getSalaryLimitTotal() != null) constructionPO.setSalaryLimitTotal(constructionVO.getSalaryLimitTotal());
	}

	private void syncConstructionInfo(ConstructionPO constructionPO, DecorationPO decorationPO) {

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(decorationPO.getOrderId());

		if (constructionInfoPO == null) {
			constructionInfoPO = new ConstructionInfoPO();
			constructionInfoPO.setOrderId(decorationPO.getOrderId());
		}

		if (constructionInfoPO.getInitDesignTime() == null) constructionInfoPO.setInitDesignTime(decorationPO.getContractTime());

		constructionInfoPO.setCid(constructionPO.getCid());
		constructionInfoDao.saveOrUpdate(constructionInfoPO);
	}
}
