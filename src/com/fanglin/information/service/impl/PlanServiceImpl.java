package com.fanglin.information.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.TaskDao;
import com.fanglin.communion.po.TaskPO;
import com.fanglin.communion.vo.TaskVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.information.dao.PlanDao;
import com.fanglin.information.dao.PlanParamDao;
import com.fanglin.information.po.PlanPO;
import com.fanglin.information.po.PlanParamPO;
import com.fanglin.information.service.PlanService;
import com.fanglin.information.vo.PlanParamVO;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("planService")
@Transactional(readOnly = true)
public class PlanServiceImpl implements PlanService {

	@Autowired
	private PlanDao planDao;

	@Autowired
	private PlanParamDao planParamDao;

	@Autowired
	private TaskDao taskDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pagePlan(Paging paging, List<Filter> filters, Authentication authentication, int company) {

		UserPO user = userDao.queryUserByUserId(authentication.getUserId());

		List<PlanPO> planPOs = planDao.pagePlan(paging, filters, user.getUid(), company);

		List<PlanVO> planVOs = new ArrayList<PlanVO>();

		PlanVO planVO;

		for (PlanPO planPO : planPOs) {

			planVO = new PlanVO(new TaskVO(), new UserBaseVO());

			BeanUtil.copyPropertie(planPO, planVO, Arrays.asList("task", "creater"));
			BeanUtil.copyPropertie(planPO.getTask(), planVO.getTask());
			BeanUtil.copyProperties(planPO.getCreater(), planVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			planVOs.add(planVO);
		}

		paging.setData(planVOs);
	}

	@Override
	public PlanVO queryPlan(PlanVO planVO) throws FLException {

		PlanPO planPO = planDao.get(planVO.getPid());

		BeanUtil.copyPropertie(planPO, planVO, Arrays.asList("param"));

		PlanParamPO planParamPO = planParamDao.queryPlanParam(planVO.getPid());

		if (planParamPO != null) {
			planVO.setParam(new PlanParamVO());

			BeanUtil.copyPropertie(planParamPO, planVO.getParam());
		}

		return planVO;
	}

	@Override
	public List<PlanVO> existPlan(PlanVO planVO, int company) throws FLException {

		TaskPO taskPO = taskDao.queryTaskByKeyWord(planVO.getTask().getKeyWord());

		if (taskPO == null) {
			throw new FLException(160028, "计划不存在");
		}

		List<PlanPO> planPOs = planDao.existPlan(taskPO.getTid(), planVO.getArgs(), company);
		List<PlanVO> planVOs = new ArrayList<PlanVO>();

		for (PlanPO planPO : planPOs) {

			planVO = new PlanVO(new TaskVO(), new UserBaseVO());

			BeanUtil.copyPropertie(planPO, planVO, Arrays.asList("task", "creater"));
			BeanUtil.copyPropertie(planPO.getTask(), planVO.getTask());
			BeanUtil.copyProperties(planPO.getCreater(), planVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			planVOs.add(planVO);
		}

		return planVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createPlan(PlanVO planVO, String userId, int company) throws FLException, ParseException {

		int systemlimit = 10;
		int userlimit = 5;

		String current = DateUtil.current("yyMMddhhmm");

		SystemConfigPO planlimit = systemConfigDao.querySystemConfig("planlimit");

		if (planlimit != null) {
			systemlimit = Integer.valueOf(planlimit.getValue());
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		int count = planDao.countPlan(userPO.getUid());

		if (count > userlimit) {
			throw new FLException(160030, "未执行任务达到上限");
		}

		TaskPO taskPO = taskDao.queryTaskByKeyWord(planVO.getTask().getKeyWord());

		if (taskPO == null) {
			throw new FLException(160028, "计划不存在");
		}

		String executeTime = planVO.getExecuteTime();

		if (executeTime == null) {
			throw new FLException(160053, "执行时间已超时");
		}

		PlanPO planPO = new PlanPO();

		if (Long.parseLong(executeTime) <= Long.parseLong(current)) {
			throw new FLException(160053, "执行时间已超时");
		}

		if (planDao.countPlan(executeTime) >= systemlimit) {
			throw new FLException(160030, "未执行任务达到上限");
		}

		if (planDao.countPlan(executeTime, userPO.getUid()) >= 1) {
			throw new FLException(160030, "未执行任务达到上限");
		}

		planPO.setExecuteTime(executeTime);

		planPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		planPO.setTask(taskPO);
		planPO.setCreater(userPO);
		planPO.setArgs(planVO.getArgs());
		planPO.setCompany(company);
		planPO.setStatus(PlanPO.STATUS_INIT_INT);

		planDao.save(planPO);

		if (planVO.getParam() != null) {

			PlanParamVO paramVO = planVO.getParam();
			PlanParamPO paramPO = new PlanParamPO();

			BeanUtil.copyPropertie(paramVO, paramPO);

			paramPO.setPid(planPO.getPid());

			planParamDao.save(paramPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePlan(PlanVO planVO, String userId) throws FLException, ParseException {

		PlanPO planPO = planDao.get(planVO.getPid());

		if (planPO == null) {
			throw new FLException(130015, "计划不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO.getUid() != planPO.getCreater().getUid()) {
			throw new FLException(160029, "计划不可操作");
		}

		if (userPO.getStatus() != PlanPO.STATUS_INIT_INT) {
			throw new FLException(160029, "计划不可操作");
		}

		TaskPO taskPO = taskDao.get(planVO.getTask().getTid());

		if (taskPO == null) {
			throw new FLException(160028, "计划不存在");
		}

		int systemlimit = 10;

		String current = DateUtil.current("yyMMddhhmm");

		SystemConfigPO planlimit = systemConfigDao.querySystemConfig("planlimit");

		if (planlimit != null) {
			systemlimit = Integer.valueOf(planlimit.getValue());
		}

		String executeTime = planVO.getExecuteTime();

		if (executeTime == null) {
			throw new FLException(160053, "执行时间已超时");
		}

		if (Integer.parseInt(executeTime) <= Integer.parseInt(current)) {
			throw new FLException(160053, "执行时间已超时");
		}

		if (planDao.countPlan(executeTime) > systemlimit) {
			throw new FLException(160030, "未执行任务达到上限");
		}

		planPO.setExecuteTime(executeTime);

		planPO.setTask(taskPO);
		planPO.setArgs(planVO.getArgs());

		planDao.update(planPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelPlan(PlanVO planVO, String userId) throws FLException {

		PlanPO planPO = planDao.get(planVO.getPid());

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (planPO == null) {
			throw new FLException(160028, "计划不存在");
		}

		if (userPO.getUid() != planPO.getCreater().getUid()) {
			throw new FLException(160029, "计划不可操作");
		}

		if (planPO.getStatus() != PlanPO.STATUS_INIT_INT) {
			throw new FLException(160029, "计划不可操作");
		}

		planPO.setStatus(PlanPO.STATUS_CANCEL_INT);

		planDao.update(planPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePlanForAdvance(PlanVO planVO) throws FLException {

		PlanPO planPO = planDao.get(planVO.getPid());

		if (planPO == null) {
			throw new FLException(160028, "计划不存在");
		}

		if (planPO.getStatus() != PlanPO.STATUS_INIT_INT && planPO.getStatus() != PlanPO.STATUS_IMME_INT) {
			throw new FLException(160029, "计划不可操作");
		}

		BeanUtil.copyPropertie(planVO, planPO, Arrays.asList("task", "args", "createTime", "executeTime", "resultFileSize", "infoFileSize"));

		planPO.setResultFileSize(Arith.add(planVO.getResultFileSize(), planPO.getResultFileSize()));
		planPO.setInfoFileSize(Arith.add(planVO.getInfoFileSize(), planPO.getInfoFileSize()));

		planDao.update(planPO);

		if (planPO.getStatus() == PlanPO.STATUS_SUCCESS_INT || planPO.getStatus() == PlanPO.STATUS_FAIL_INT) {

			String content = String.format("%s 时间创建的 %s 计划 , 已完成 . ", planPO.getCreateTime(), planPO.getTask().getName());

			messageService.sendMessage(planPO.getCreater().getUserId(), "计划", content, null, planPO.getCreater().getCompany());
		}

		return 0;
	}
}
