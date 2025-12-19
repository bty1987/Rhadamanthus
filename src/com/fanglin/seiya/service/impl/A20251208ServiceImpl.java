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
import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.service.SurveyService;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.DutmentPO;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.seiya.service.A20251208Service;
import com.fanglin.system.dao.CompanyDao;
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
	private MessageService messageService;

	@Autowired
	private ConstructerDao constructerDao;

	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveOrUpdateUserForPlatforPm(UserInfoVO userInfoVO, int company, String userId) throws FLException {
		UserVO userVO = userInfoVO.getUser();

		UserInfoPO userInfoPO = userInfoDao.queryUserInfoByUserId(userVO.getUserId());

		UserPO userPO = null;

		if (userInfoPO == null) {

			CompanyPO companyPO = companyDao.get(company);

			if (companyPO == null) {
				throw new FLException(230015, "公司不存在");
			}

			SystemConfigPO userlimit = systemConfigDao.querySystemConfig("userlimit", company);

			if (userDao.countUserByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
				throw new FLException(190008, "人员数已达上限, 公司上限");
			}

			List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(userVO.getPhone(), userVO.getIdentity());

			if (userPOs.size() > 0) {
				throw new FLException(190006, "人员已存在");
			}

			userPO = userDao.queryUserByLoginId(userVO.getLoginId());

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

			userPO.setDept(departmentPO);

			userPO.setDuty(dutyDao.get(userVO.getDuty().getDid()));

			userPO.setPinYin(PinYin4Util.getPinyin(userVO.getCurrentName()).get(0));

			userPO.setIsUpdate(UserPO.ISUPDATE_ADD_INT);

			userInfoPO = new UserInfoPO();
		} else {
			userPO = userInfoPO.getUser();

			DepartmentPO departmentPO = departmentDao.get(userVO.getDept().getDid());

			if (departmentPO.getFatherDept() == null) {
				throw new FLException(310002, "部门不可添加人员");
			}
		}

		BeanUtil.copyProperties(userVO, userPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		userDao.saveOrUpdate(userPO);

		userVO.setUid(userPO.getUid());

		BeanUtil.copyProperties(userInfoVO, userInfoPO, Arrays.asList("user", "fangliner"));

		userInfoPO.setUser(userPO);
		userInfoPO.setHireTime(DateUtil.getDateToTimestamp(new Date()));

		userInfoDao.saveOrUpdate(userInfoPO);

		userInfoVO.getUser().ptv(userInfoPO.getUser());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int beginConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = null;

		if (constructionScheduleVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());
		} else {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionScheduleVO.getCnid());
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

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_BEGIN_INT) {
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

		String content = String.format("装修单: %s, 地址: %s %s, 预计完工时间: %s , 还剩%s日 , 请及时对接完工安排 ", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber(), finishTime, finishDay + 1);

		messageService.sendMessage(constructionPO.getSupervisor().getUserId(), decorationPO.getCreater().getUserId(), content, MessagePO.TYPE_SEND_CONSTRUCTION_INT, decorationPO.getCompany());

		constructionScheduleVO.setEndTime(constructionSchedulePO.getEndTime());

		return 0;
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
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
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

		if (constructerVO.getUser() == null && constructerVO.getUser().getUserId() == null) {
			constructerPO = constructerDao.get(constructerVO.getCrid());
		} else {
			UserPO userPO = userDao.queryUserByUserId(constructerVO.getUser().getUserId());
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
}
