/**
 * @File Name		: ApprovalTaskDaoImpl.java
 * @Package   		: com.fanglin.approval.dao.impl
 * @Version			: 1.0
 * @Description		: 审批任务 DAO 实现
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalTaskDao;
import com.fanglin.approval.po.ApprovalTaskPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalTaskDao")
public class ApprovalTaskDaoImpl extends DaoImpl<ApprovalTaskPO> implements ApprovalTaskDao {

	public ApprovalTaskDaoImpl() {
		super(ApprovalTaskPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalTaskPO> queryApprovalTaskByAidNode(long aid, long nodeId) {

		return session().createCriteria(ApprovalTaskPO.class)
			.add(Restrictions.eq("aid", aid))
			.add(Restrictions.eq("nodeId", nodeId))
			.addOrder(Order.asc("taskId"))
			.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalTaskPO> queryApprovalTaskByAid(long aid) {

		return session().createCriteria(ApprovalTaskPO.class)
			.add(Restrictions.eq("aid", aid))
			.addOrder(Order.asc("nodeSeq"))
			.addOrder(Order.asc("actionTime"))
			.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalTaskPO> queryApprovalTaskByAssignee(String assigneeId, short status) {

		return session().createCriteria(ApprovalTaskPO.class)
			.add(Restrictions.eq("assigneeId", assigneeId))
			.add(Restrictions.eq("status", status))
			.addOrder(Order.desc("assignTime"))
			.list();
	}

	@Override
	public int invalidPendingTask(long aid, long nodeId, long excludeTaskId) {

		String sql = "UPDATE approval.approvaltask SET status = :invalidStatus WHERE aid = :aid AND nodeId = :nodeId AND status = :pendingStatus AND taskId <> :excludeTaskId";

		return session().createSQLQuery(sql)
			.setShort("invalidStatus", ApprovalTaskPO.STATUS_INVALID_INT)
			.setLong("aid", aid)
			.setLong("nodeId", nodeId)
			.setShort("pendingStatus", ApprovalTaskPO.STATUS_PENDING_INT)
			.setLong("excludeTaskId", excludeTaskId)
			.executeUpdate();
	}

	@Override
	public boolean hasTask(long aid) {

		String sql = "SELECT COUNT(1) FROM approval.approvaltask WHERE aid = :aid";

		Number count = (Number) session().createSQLQuery(sql).setLong("aid", aid).uniqueResult();

		return count != null && count.longValue() > 0;
	}

	@Override
	public ApprovalTaskPO queryPendingTask(long aid, String assigneeId) {

		return (ApprovalTaskPO) session().createCriteria(ApprovalTaskPO.class)
			.add(Restrictions.eq("aid", aid))
			.add(Restrictions.eq("assigneeId", assigneeId))
			.add(Restrictions.eq("status", ApprovalTaskPO.STATUS_PENDING_INT))
			.addOrder(Order.asc("taskId"))
			.setMaxResults(1)
			.uniqueResult();
	}

}
