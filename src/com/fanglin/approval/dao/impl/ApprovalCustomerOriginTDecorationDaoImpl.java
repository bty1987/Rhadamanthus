package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalCustomerOriginTDecorationDao")
public class ApprovalCustomerOriginTDecorationDaoImpl extends DaoImpl<ApprovalCustomerOriginTDecorationPO> implements ApprovalCustomerOriginTDecorationDao {

	public ApprovalCustomerOriginTDecorationDaoImpl(){
		super(ApprovalCustomerOriginTDecorationPO.class);
	}
	
	@Override
	public List<ApprovalCustomerOriginTDecorationPO> pageApprovalCustomerOriginTDecorationPO(Paging paging, List<Filter> filters, Integer company)throws FLException {
		
		PagingQuery<ApprovalCustomerOriginTDecorationPO> query = pagingQuery(paging, ApprovalCustomerOriginTDecorationPO.class);

		queryFilterExcute(query, filters, "");

		return query.list();

	}
	
	@Override
	public ApprovalCustomerOriginTDecorationPO queryCustomerOriginTDecorationByAid(long aid) {
		
		return (ApprovalCustomerOriginTDecorationPO) session().createCriteria(ApprovalCustomerOriginTDecorationPO.class).add(Restrictions.eq("aid", aid)).uniqueResult();
	
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
				query.add(query.getCriterion("customerOrigin.houseNumber", filter));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion("customerOrigin.phone", filter));
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
			} else if ("user.userId".equals(field)) {
				query.alias("customerOrigin.creater", "creater");
				query.add(query.getCriterion("creater.userId", filter));	
			}
		}
	}

}
