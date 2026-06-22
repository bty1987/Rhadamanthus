package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalSalesRefundDao;
import com.fanglin.approval.po.ApprovalSalesRefundAO;
import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalSalesRefundDao")
public class ApprovalSalesRefundDaoImpl extends DaoImpl<ApprovalSalesRefundPO> implements ApprovalSalesRefundDao {

	public ApprovalSalesRefundDaoImpl() {
		super(ApprovalSalesRefundPO.class);
	}

	@Override
	public List<ApprovalSalesRefundAO> pageApprovalSalesRefund(Paging paging, List<Filter> filters, Integer company) throws FLException {
		PagingQuery<ApprovalSalesRefundAO> query = pagingQuery(paging, ApprovalSalesRefundAO.class);

		queryFilterExcute(query, filters, "");

		return query.list();
	}

	@Override
	public ApprovalSalesRefundPO queryApprovalSalesRefundByAId(long aId) {
		return (ApprovalSalesRefundPO) session().createCriteria(ApprovalSalesRefundPO.class).add(Restrictions.eq(ApprovalSalesRefundPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("sales", "sales");
			if ("village".equals(field)) {
				query.alias("sales.house", "house");
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", filter));
			} else if ("houseNumber".equals(field)) {
				query.alias("sales.house", "house");
				query.add(query.getCriterion("house.houseNumber", filter));
			} else if ("phone".equals(field)) {
				query.alias("sales.customer", "customer");
				query.add(Restrictions.in("customer.phone", SensitiveDataHelper.getAllEncryptedForms(filter.getData())));
			} else if ("name".equals(field)) {
				query.alias("sales.customer", "customer");
				query.add(query.getCriterion("customer.name", filter));
			} else if ("user.userId".equals(field)) {
				query.alias("sales.creater", "creater");
				query.add(query.getCriterion("creater.userId", filter));
			} else if ("createTime".equals(field)) {
				query.timeranges("sales.createTime", data);
			} else if ("sales.no".equals(field)) {
				query.add(query.getCriterion("sales.no", filter));
			} else if ("sales.category".equals(field)) {
				query.add(query.getCriterion("sales.category", filter));
			} else if ("sales.brand.bid".equals(field)) {
				query.add(query.getCriterion("sales.brand.bid", Long.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("sales.status", Short.valueOf(data), op));
			}
		}
	}

}
