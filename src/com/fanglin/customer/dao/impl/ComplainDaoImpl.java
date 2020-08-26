package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ComplainDao;
import com.fanglin.customer.po.ComplainPO;
import com.fanglin.utils.Paging;

@Repository("complainDao")
public class ComplainDaoImpl extends DaoImpl<ComplainPO> implements ComplainDao {
	
	public ComplainDaoImpl() {
		super(ComplainPO.class);
	}

	@Override
	public List<ComplainPO> pageComplain(Paging paging, List<Filter> filters, int company) {
		
		
		PagingQuery<ComplainPO> query = pagingQuery(paging, ComplainPO.class);
		
		query.add(query.getCriterion(ComplainPO.COLUMN_COMPANY_STR, company, "eq"));

		query.desc("cid");
		
		queryFilterExcute(query, filters);
		
		return query.list();

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ComplainPO> queryComplain(long csid) {

		return createCriteria(ComplainPO.class).add(Restrictions.eq(ComplainPO.COLUMN_CSID_STR, csid)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ComplainPO> queryComplainByOrderId(String orderId) {

		return createCriteria(ComplainPO.class).createAlias("decoration", "decoration").add(Restrictions.eq(ComplainPO.COLUMN_ORDERID_STR, orderId)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		query.alias("decoration", "decoration");
		
		if (filters == null)
			return;

		for (Filter filter : filters) {

			String filet = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			
			if ("orderId".equals(filet)) {
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("creater".equals(filet)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("updater".equals(filet)) {
				query.alias("updater", "updater");
				query.add(query.getCriterion("updater.userId", data, op));
			} else if ("level".equals(filet)) {
				query.add(query.getCriterion("level", Short.parseShort(data), op));
			} else if ("status".equals(filet)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			} 
		}
	}

}
