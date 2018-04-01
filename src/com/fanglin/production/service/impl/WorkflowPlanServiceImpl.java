package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.production.dao.WorkflowPlanDao;
import com.fanglin.production.po.WorkflowPO;
import com.fanglin.production.po.WorkflowPlanPO;
import com.fanglin.production.po.WorkplanPO;
import com.fanglin.production.service.WorkFlowPlanService;
import com.fanglin.production.vo.WorkflowPlanVO;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.production.vo.WorkplanVO;
import com.fanglin.production.vo.WorkshopVO;
import com.fanglin.utils.BeanUtil;

@Service("workflowPlanService")
@Transactional(readOnly = true)
public class WorkflowPlanServiceImpl implements WorkFlowPlanService {

	@Autowired
	private WorkflowPlanDao workflowPlanDao;

	@Override
	public List<WorkflowPlanVO> queryWorkflowPlanByWfid(WorkflowPlanVO workflowPlanVO) {

		List<WorkflowPlanPO> WorkflowPlanPOS = workflowPlanDao.queryWorkflowPlanByWfid(workflowPlanVO.getWorkflow().getWfid());
		List<WorkflowPlanVO> workflowPlans = new ArrayList<WorkflowPlanVO>();
		
		for (WorkflowPlanPO workflowPlanPO : WorkflowPlanPOS) {
			workflowPlanVO = new WorkflowPlanVO(new WorkflowVO(), new WorkplanVO(), new WorkshopVO());

			BeanUtil.copyProperties(workflowPlanPO, workflowPlanVO, Arrays.asList("workflow", "workplan"));
			BeanUtil.copyProperties(workflowPlanPO.getWorkflow(), workflowPlanVO.getWorkflow());
			BeanUtil.copyProperties(workflowPlanPO.getWorkplan(), workflowPlanVO.getWorkplan(), Arrays.asList("workshop"));
			BeanUtil.copyProperties(workflowPlanPO.getWorkplan().getWorkshop(), workflowPlanVO.getWorkplan().getWorkshop());

			workflowPlans.add(workflowPlanVO);
		}

		return workflowPlans;
	}

	@Override
	public List<WorkflowPlanVO> queryWorkflowPlanByWpid(WorkflowPlanVO workflowPlanVO) {

		List<WorkflowPlanPO> WorkflowPlanPOS = workflowPlanDao.queryWorkflowPlanByWpid(workflowPlanVO.getWorkplan().getWpid());
		List<WorkflowPlanVO> workflowPlans = new ArrayList<WorkflowPlanVO>();
		
		for (WorkflowPlanPO workflowPlanPO : WorkflowPlanPOS) {
			workflowPlanVO = new WorkflowPlanVO(new WorkflowVO(), new WorkplanVO());

			BeanUtil.copyProperties(workflowPlanPO, workflowPlanVO, Arrays.asList("workflow", "workplan"));
			BeanUtil.copyProperties(workflowPlanPO.getWorkflow(), workflowPlanVO.getWorkflow());
			BeanUtil.copyProperties(workflowPlanPO.getWorkplan(), workflowPlanVO.getWorkplan(), Arrays.asList("workshop"));

			workflowPlans.add(workflowPlanVO);
		}

		return workflowPlans;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkflowPlan(WorkflowPlanVO workflowPlanVO, List<Long> wfids) throws Exception {
		
		long wpid = workflowPlanVO.getWorkplan().getWpid();

		workflowPlanDao.deleteWorkflowPlan(wpid);

		if (wfids != null) {
			for (long wfid : wfids) {
				workflowPlanDao.save(new WorkflowPlanPO(new WorkflowPO(wfid), new WorkplanPO(wpid)));
			}
		}
		
		return 0;
	}

}
