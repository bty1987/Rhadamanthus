/**
 * @File Name		: ApprovalFlowNodeDaoImpl.java
 * @Package   		: com.fanglin.approval.dao.impl
 * @Version			: 1.0
 * @Description		: 审批流程节点定义 DAO 实现
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalFlowNodeDao;
import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalFlowNodeDao")
public class ApprovalFlowNodeDaoImpl extends DaoImpl<ApprovalFlowNodePO> implements ApprovalFlowNodeDao {

	public ApprovalFlowNodeDaoImpl() {
		super(ApprovalFlowNodePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalFlowNodePO> queryApprovalFlowNodeByFlowId(long flowId) {

		return session().createCriteria(ApprovalFlowNodePO.class)
			.add(Restrictions.eq("flowId", flowId))
			.add(Restrictions.eq("status", ApprovalFlowNodePO.STATUS_ENABLED_INT))
			.addOrder(Order.asc("nodeSeq"))
			.list();
	}

	@Override
	public int deleteApprovalFlowNodeByFlowId(long flowId) {

		String sql = "DELETE FROM approval.approvalflownode WHERE flowId = :flowId";

		return session().createSQLQuery(sql).setLong("flowId", flowId).executeUpdate();
	}

}
