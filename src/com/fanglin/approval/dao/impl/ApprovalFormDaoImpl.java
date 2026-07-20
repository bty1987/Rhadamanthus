/**
 * @File Name		: ApprovalFormDaoImpl.java
 * @Package   		: com.fanglin.approval.dao.impl
 * @Version			: 1.0
 * @Description		: 审批表单定义 DAO 实现
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalFormDao;
import com.fanglin.approval.po.ApprovalFormPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalFormDao")
public class ApprovalFormDaoImpl extends DaoImpl<ApprovalFormPO> implements ApprovalFormDao {

	public ApprovalFormDaoImpl() {
		super(ApprovalFormPO.class);
	}

	@Override
	public List<ApprovalFormPO> pageApprovalForm(Paging paging, List<Filter> filters) {

		PagingQuery<ApprovalFormPO> query = pagingQuery(paging, ApprovalFormPO.class);

		queryFilterExcute(filters, query);

		return query.list();
	}

	@Override
	public ApprovalFormPO queryApprovalFormByFlowId(long flowId) {

		return (ApprovalFormPO) session().createCriteria(ApprovalFormPO.class)
			.add(Restrictions.eq("flowId", flowId))
			.add(Restrictions.eq("status", ApprovalFormPO.STATUS_ENABLED_INT))
			.setMaxResults(1).uniqueResult();
	}

	@Override
	public ApprovalFormPO queryApprovalForm(String code, int company) {

		return (ApprovalFormPO) session().createCriteria(ApprovalFormPO.class)
			.add(Restrictions.eq("code", code))
			.add(Restrictions.or(
				Restrictions.eq("company", company),
				Restrictions.eq("company", 0)))
			.addOrder(Order.desc("company"))
			.setMaxResults(1).uniqueResult();
	}

	public void queryFilterExcute(List<Filter> filters, PagingQuery<ApprovalFormPO> query) {

		if (filters == null || filters.isEmpty()) {
			return;
		}

		for (Filter filter : filters) {
			if ("code".equals(filter.getField())) {
				query.add(query.getCriterion("code", filter.getData(), filter.getOp()));
			} else if ("name".equals(filter.getField())) {
				query.add(query.getCriterion("name", filter.getData(), filter.getOp()));
			} else if ("status".equals(filter.getField())) {
				query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("flowId".equals(filter.getField())) {
				query.add(query.getCriterion("flowId", Long.valueOf(filter.getData()), filter.getOp()));
			}
		}
	}

}
