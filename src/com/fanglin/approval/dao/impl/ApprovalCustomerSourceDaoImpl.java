package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerSourceDao;
import com.fanglin.approval.po.ApprovalCustomerSourceAO;
import com.fanglin.approval.po.ApprovalCustomerSourcePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalCustomerSourceDao")
public class ApprovalCustomerSourceDaoImpl extends DaoImpl<ApprovalCustomerSourcePO> implements ApprovalCustomerSourceDao {

	public ApprovalCustomerSourceDaoImpl() {
		super(ApprovalCustomerSourcePO.class);
	}

	@Override
	public List<ApprovalCustomerSourceAO> pageApprovalCustomerSource(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<ApprovalCustomerSourceAO> query = pagingQuery(paging, ApprovalCustomerSourceAO.class);

		queryFilterExcute(query, filters, "");

		return query.list();
	}

	@Override
	public ApprovalCustomerSourcePO queryApprovalCustomerSourceByAid(long aid) {
		return (ApprovalCustomerSourcePO) session().createCriteria(ApprovalCustomerSourcePO.class).add(Restrictions.eq("aid", aid)).uniqueResult();
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();

			query.alias("customerSource", "customerSource");

			if ("village".equals(field)) {
				query.alias("house", "house");
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", filter));
			} else if ("houseNumber".equals(field)) {
				query.alias("house", "house");
				query.add(query.getCriterion("house.houseNumber", filter));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion("customerSource.phone", filter));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("customerSource.name", filter));
			} else if ("user.userId".equals(field)) {
				query.alias("customerSource.creater", "creater");
				query.add(query.getCriterion("creater.userId", filter));
			} else if ("createTime".equals(field)) {
				query.timeranges("customerSource.createTime", filter.getData());
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("customerSource.status", Short.valueOf(filter.getData()), filter.getOp()));
			}
		}
	}
}
