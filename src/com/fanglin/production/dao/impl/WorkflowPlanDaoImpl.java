package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.WorkflowPlanDao;
import com.fanglin.production.po.WorkflowPlanPO;

@Repository("workflowPlanDao")
public class WorkflowPlanDaoImpl extends DaoImpl<WorkflowPlanPO> implements WorkflowPlanDao {

	public WorkflowPlanDaoImpl() {
		super(WorkflowPlanPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkflowPlanPO> queryWorkflowPlanByWfid(Long wfid) {
		return session().createCriteria(WorkflowPlanPO.class).add(Restrictions.eq(WorkflowPlanPO.WORKFLOW_WFID, wfid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkflowPlanPO> queryWorkflowPlanByWpid(Long wpid) {
		return session().createCriteria(WorkflowPlanPO.class).add(Restrictions.eq(WorkflowPlanPO.WORKFLOWPLAN_WPID, wpid)).list();
	}

	@Override
	public int deleteWorkflowPlan(Long wpid) {

		String sql = "delete from production.workflowplan where wpid= :wpid";
		session().createSQLQuery(sql).setLong("wpid", wpid).executeUpdate();

		return 0;
	}

}
