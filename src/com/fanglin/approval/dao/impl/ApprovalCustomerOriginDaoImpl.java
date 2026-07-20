/**
 * @File Name		: ApprovalCustomerOriginDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-10-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerOriginDao;
import com.fanglin.approval.po.ApprovalCustomerOriginAO;
import com.fanglin.approval.po.ApprovalCustomerOriginPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalCustomerOriginDao")
public class ApprovalCustomerOriginDaoImpl extends DaoImpl<ApprovalCustomerOriginPO> implements ApprovalCustomerOriginDao {

	public ApprovalCustomerOriginDaoImpl() {
		super(ApprovalCustomerOriginPO.class);
	}

	@Override
	public List<ApprovalCustomerOriginAO> pageApprovalCustomerOrigin(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<ApprovalCustomerOriginAO> query = pagingQuery(paging, ApprovalCustomerOriginAO.class);

		queryFilterExcute(query, filters, "");

		return query.list();
	}

	@Override
	public ApprovalCustomerOriginPO queryCustomerOriginByAid(long aid) {
		return (ApprovalCustomerOriginPO) session().createCriteria(ApprovalCustomerOriginPO.class).add(Restrictions.eq("aid", aid)).setMaxResults(1).uniqueResult();
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();

			query.alias("customerOrigin", "customerOrigin");

			if ("village".equals(field)) {
				query.alias("customerOrigin.village", "village");
				query.add(query.getCriterion("village.no", filter));
			} else if ("houseNumber".equals(field)) {
				query.add(Restrictions.in("customerOrigin.houseNumber", SensitiveDataHelper.getAllEncryptedForms(filter.getData())));
			} else if ("phone".equals(field)) {
				query.add(Restrictions.in("customerOrigin.phone", SensitiveDataHelper.getAllEncryptedForms(filter.getData())));
			} else if ("createTime".equals(field)) {
				query.timeranges("customerOrigin.createTime", filter.getData());
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("customerOrigin.status", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("designer.userId".equals(field)) {
				query.alias("customerOrigin.designer", "designer");
				query.add(query.getCriterion("designer.userId", filter));
			} else if ("salesman.userId".equals(field)) {
				query.alias("customerOrigin.salesman", "salesman");
				query.add(query.getCriterion("salesman.userId", filter));
			}
		}
	}

}
