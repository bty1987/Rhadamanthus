package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesRefundsDao;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.utils.Paging;

@Repository("salesRefundsDao")
public class SalesRefundsDaoImpl extends DaoImpl<SalesRefundsPO> implements SalesRefundsDao {

	public SalesRefundsDaoImpl() {
		super(SalesRefundsPO.class);
	}

	@Override
	public List<SalesRefundsPO> pageSalesRefunds(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<SalesRefundsPO> query = pagingQuery(paging, SalesRefundsPO.class);

		query.alias("sales", "sales");
		query.add(query.getCriterion("sales.company", company, "eq"));

		queryFilterExecute(query, filters);

		query.desc("rid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesRefundsPO> querySalesRefundsBySid(Long sid) {
		return createCriteria(SalesRefundsPO.class).add(Restrictions.eq(SalesRefundsPO.COLUMN_SID_STR, sid)).list();
	}

	@Override
	public void updateSalesRefundsForStatusBySpid(Long spid, short status) {

		String sql = "update sales.salesrefunds set status = :status where spid = :spid";

		session().createSQLQuery(sql).setShort("status", status).setLong("spid", spid).executeUpdate();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		SalesDaoImpl.queryFilterExcute(query, filters, "sales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("refunds.status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("refunds.isAffirm".equals(field)) {
				query.add(query.getCriterion("isAffirm", Short.valueOf(data), op));
			} else if ("refunds.affirmTime.range".equals(field)) {
				query.timeranges("affirmTime", filter.getData());
			}
		}
	}

}
