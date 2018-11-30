package com.fanglin.information.service.impl;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.PlanDao;
import com.fanglin.information.dao.TaskDao;
import com.fanglin.information.po.PlanPO;
import com.fanglin.information.po.TaskPO;
import com.fanglin.information.service.PlanService;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.information.vo.TaskVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("planService")
@Transactional(readOnly = true)
public class PlanServiceImpl implements PlanService {

	@Autowired
	private PlanDao planDao;

	@Autowired
	private TaskDao taskDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao ;

	@Override
	public void pagePlan(Paging paging, List<Filter> filters, Authentication authentication, int company) {

		UserPO user = userDao.queryUserByUserId(authentication.getUserId());
		
		List<PlanPO> planPOs = planDao.pagePlan(paging, filters,user.getUid(), company);
		
		
		List<PlanVO> planVOs = new ArrayList<PlanVO>();
		
		PlanVO planVO;

		for (PlanPO planPO : planPOs) {

			planVO = new PlanVO(new TaskVO(), new UserBaseVO());

			BeanUtil.copyPropertie(planPO, planVO, Arrays.asList("task", "creater"));
			BeanUtil.copyPropertie(planPO.getTask(), planVO.getTask());
			BeanUtil.copyProperties(planPO.getCreater(), planVO.getCreater(), Arrays.asList("role", "dept","duty", "password", "identity","company"));

			planVOs.add(planVO);
		}
		paging.setData(planVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createPlan(PlanVO planVO, String userId, int company) throws FLException, ParseException {

		SystemConfigPO planlimit = systemConfigDao.querySystemConfig("planlimit");
		
		int size = 10;
		if (planlimit != null){
			size = Integer.valueOf(planlimit.getValue());
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		int count = planDao.countPlanByCuid(userPO.getUid());

		if (count > 5) {
			throw new FLException(160030, "未执行任务达到上限");
		}
		
		TaskPO taskPO = taskDao.queryTaskByKeyWord(planVO.getTask().getKeyWord());

		if (taskPO == null) {
			throw new FLException(160028, "计划不存在");
		}

		PlanPO planPO = new PlanPO();

		if (planVO.getExecuteTime() != null) {

			String executeTime = DateUtil.getDateToDateString(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(planVO.getExecuteTime()), "yyMMddHHmm");

			if (planDao.countPlanByExecuteTime(executeTime) >= size) {
				throw new FLException(160030, "未执行任务达到上限");
			}
			
			if (planDao.countPlanByExecuteTimAndCuid(executeTime, userPO.getUid())>= 1) {
				throw new FLException(160030, "未执行任务达到上限");
			}

			planPO.setExecuteTime(executeTime);
		} else {
			if (planDao.countPlanRightNow() >= size) {
				throw new FLException(160030, "未执行任务达到上限");
			}
		}

		planPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		planPO.setTask(taskPO);
		planPO.setCreater(userPO);
		planPO.setArgs(planVO.getArgs());
		planPO.setCompany(company);
		planPO.setStatus(PlanPO.STATUS_INIT_INT);

		planDao.save(planPO);

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
		
		if (userPO.getStatus() != 0) {
			throw new FLException(160029, "计划不可操作");
		}
		
		TaskPO taskPO = taskDao.get(planVO.getTask().getTid());

		if (taskPO == null) {
			throw new FLException(160028, "计划不存在");
		}
		
		SystemConfigPO planlimit = systemConfigDao.querySystemConfig("planlimit");
		
		int size = 10;
		if (planlimit != null){
			size = Integer.valueOf(planlimit.getValue());
		}
		
		if (planVO.getExecuteTime() != null) {

			String executeTime = DateUtil.getDateToDateString(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(planVO.getExecuteTime()), "yyMMddHHmm");

			if (executeTime != planPO.getExecuteTime()) {
				
				if (planDao.countPlanByExecuteTime(executeTime) > size) {
					throw new FLException(160030, "未执行任务达到上限");
				}

				planPO.setExecuteTime(executeTime);
			}
		} else {
			
			if (planDao.countPlanRightNow() > size) {
				throw new FLException(160030, "未执行任务达到上限");
			}
			
			planPO.setExecuteTime(planVO.getExecuteTime());
		}

		planPO.setTask(taskPO);
		planPO.setArgs(planVO.getArgs());

		planDao.update(planPO);

		if (planVO.getExecuteTime() == null) {
			try {
				Runtime.getRuntime().exec(String.format("%s %s %s %s %s", taskPO.getType() == TaskPO.TYPE_PYTHON_INT ? "python" : "sh", taskPO.getFilepath(), planPO.getPid(), planPO.getArgs(), " &"));
			} catch (IOException e) {
				planPO.setStatus(PlanPO.STATUS_FAIL_INT);
				planPO.setInfo("计划执行失败");

				planDao.update(planPO);
			}
		}

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

		if (planPO.getStatus() != 0) {
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
		
		if (planPO.getStatus() != 0 && planPO.getStatus()!= 4) {
			throw new FLException(160029, "计划不可操作");
		}
		
		BeanUtil.copyPropertie(planVO, planPO, Arrays.asList("task", "args", "createTime", "executeTime"));
		
		planDao.update(planPO);
		
		return 0;
	}

}
