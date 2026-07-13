/**
 * @File Name		: ApprovalFlowDaoImpl.java
 * @Package   		: com.fanglin.approval.dao.impl
 * @Version			: 1.0
 * @Description		: 审批流程定义 DAO 实现
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalFlowDao;
import com.fanglin.approval.po.ApprovalFlowPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalFlowDao")
public class ApprovalFlowDaoImpl extends DaoImpl<ApprovalFlowPO> implements ApprovalFlowDao {

	public ApprovalFlowDaoImpl() {
		super(ApprovalFlowPO.class);
	}

	@Override
	public List<ApprovalFlowPO> pageApprovalFlow(Paging paging, List<Filter> filters) {

		PagingQuery<ApprovalFlowPO> query = pagingQuery(paging, ApprovalFlowPO.class);

		queryFilterExcute(filters, query);

		return query.list();
	}

	@Override
	public ApprovalFlowPO queryEnabledFlow(short businessType, int company) {

		return (ApprovalFlowPO) session().createCriteria(ApprovalFlowPO.class)
			.add(Restrictions.eq("businessType", businessType))
			.add(Restrictions.eq("status", ApprovalFlowPO.STATUS_ENABLED_INT))
			.add(Restrictions.or(
				Restrictions.eq("company", company),
				Restrictions.eq("company", 0)))
			.addOrder(Order.desc("company"))
			.uniqueResult();
	}

	@Override
	public ApprovalFlowPO queryApprovalFlow(String code, int company, int version) {

		return (ApprovalFlowPO) session().createCriteria(ApprovalFlowPO.class)
			.add(Restrictions.eq("code", code))
			.add(Restrictions.eq("company", company))
			.add(Restrictions.eq("version", version))
			.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalFlowPO> queryApprovalFlow(int company) {

		return session().createCriteria(ApprovalFlowPO.class)
			.add(Restrictions.or(
				Restrictions.eq("company", company),
				Restrictions.eq("company", 0)))
			.addOrder(Order.asc("businessType"))
			.list();
	}

	public void queryFilterExcute(List<Filter> filters, PagingQuery<ApprovalFlowPO> query) {

		if (filters == null || filters.isEmpty()) {
			return;
		}

		for (Filter filter : filters) {
			if ("businessType".equals(filter.getField())) {
				query.add(query.getCriterion("businessType", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("status".equals(filter.getField())) {
				query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("code".equals(filter.getField())) {
				query.add(query.getCriterion("code", filter.getData(), filter.getOp()));
			} else if ("name".equals(filter.getField())) {
				query.add(query.getCriterion("name", filter.getData(), filter.getOp()));
			}
		}
	}

}
