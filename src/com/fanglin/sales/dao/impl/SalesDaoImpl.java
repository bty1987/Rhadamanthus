package com.fanglin.sales.dao.impl;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Paging;

@Repository("salesDao")
public class SalesDaoImpl extends DaoImpl<SalesPO> implements SalesDao {

	public SalesDaoImpl() {
		super(SalesPO.class);
	}

	@Override
	public List<SalesPO> pageSales(Paging paging, List<Filter> filters, int company, int uid) throws FLException {
		
		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR, company, "eq"));

		query.add(Restrictions.or(Restrictions.or(query.getCriterion(SalesPO.COLUMN_GUID_STR, uid, "eq"), query.getCriterion(SalesPO.COLUMN_ISID_STR, uid, "eq")), query.getCriterion(SalesPO.COLUMN_SALESMANID_STR, uid, "eq")));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}

	@Override
	public List<SalesPO> pageSalesForAdvance(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}

	@Override
	public List<SalesPO> pageSalesForBalance(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR, company, "eq"));

		query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYSTATUS_STR, SalesPO.FULLPAYSTATUS_CONFIRM_SHORT, "eq"));
		query.add(query.getCriterion(SalesPO.COLUMN_BALANCESTATUS_STR, SalesPO.BALANCESTATUS_INIT_SHORT, "eq"));
		query.add(query.getCriterion(SalesPO.COLUMN_STATUS_STR, Arrays.asList(SalesPO.STATUS_INIT_SHORT, SalesPO.STATUS_END_SHORT), "in"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}

	@Override
	public List<SalesPO> pageSalesForDompany(Paging paging, List<Filter> filters, int dompany) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_DOMPANY_STR, dompany, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();

	}

	@Override
	public List<SalesPO> pageSalesForBalanceByDompany(Paging paging, List<Filter> filters, int dompany) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_DOMPANY_STR, dompany, "eq"));

		query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYSTATUS_STR, SalesPO.FULLPAYSTATUS_CONFIRM_SHORT, "eq"));
		query.add(query.getCriterion(SalesPO.COLUMN_BALANCESTATUS_STR, SalesPO.BALANCESTATUS_INIT_SHORT, "eq"));
		query.add(query.getCriterion(SalesPO.COLUMN_STATUS_STR, Arrays.asList(SalesPO.STATUS_INIT_SHORT, SalesPO.STATUS_END_SHORT), "in"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}

	@Override
	public List<SalesPO> pageSalesForPompany(Paging paging, List<Filter> filters, int pompany) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_POMPANY_STR, pompany, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}

	@Override
	public List<SalesPO> pageSalesForBalanceByPompany(Paging paging, List<Filter> filters, int pompany) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_POMPANY_STR, pompany, "eq"));

		query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYSTATUS_STR, SalesPO.FULLPAYSTATUS_CONFIRM_SHORT, "eq"));
		query.add(query.getCriterion(SalesPO.COLUMN_BALANCESTATUS_STR, SalesPO.BALANCESTATUS_INIT_SHORT, "eq"));
		query.add(query.getCriterion(SalesPO.COLUMN_STATUS_STR, Arrays.asList(SalesPO.STATUS_INIT_SHORT, SalesPO.STATUS_END_SHORT), "in"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}

	@Override
	public List<SalesPO> pageSalesForSupplier(Paging paging, List<Filter> filters, int company, int uid) throws FLException {

		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);

		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR, company, "eq"));

		query.add(query.getCriterion(SalesPO.COLUMN_OCUID_STR, uid, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sid");

		return query.list();
	}
	
	@Override
	public List<SalesPO> pageSalesByOrderId(Paging paging, List<Filter> filters, int company, String orderId) {
		
		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);
		
		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR, company, "eq"));
		
		query.add(query.getCriterion("orderId", orderId, "eq"));
		
		return query.list();
	}

	@Override
	public SalesPO querySalesByNo(String no) {
		return (SalesPO) createCriteria(SalesPO.class).add(Restrictions.eq(SalesPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPO> querySalesByOrderId(String orderId) {
		return createCriteria(SalesPO.class).add(Restrictions.eq(SalesPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	public int countSalesByOrderId(String orderId, short status) {

		String sql = "SELECT count(*) FROM sales.sales where orderId=:orderId and status=:status";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setShort("status", status).uniqueResult();

		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<SalesPO> query, List<Filter> filters) throws FLException {
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("instorer", "instorer");
				query.alias("salesman", "salesman");
				query.alias("guider", "guider");
				query.alias("dept", "dept");
				if (SalesPO.COLUMN_NO_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (SalesPO.COLUMN_ORDERID_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (SalesPO.COLUMN_BRAND_STR.equals(field)) {
					query.add(query.getCriterion(SalesPO.COLUMN_BRAND_STR, data, op));
				}else if (SalesPO.COLUMN_CATEGORY_STR.equals(field)) {
						query.add(query.getCriterion(SalesPO.COLUMN_CATEGORY_STR, data, op));
				} else if (SalesPO.COLUMN_BID_STR.equals(field)) {
					query.add(query.getCriterion(SalesPO.COLUMN_BID_STR, Long.valueOf(data), op));
				} else if (SalesPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(SalesPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}else if (SalesPO.COLUMN_FULLPAYSTATUS_STR.equals(field)) {
						query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYSTATUS_STR, Short.valueOf(data), op));
				} else if ("instorer".equals(field)) {
					query.add(query.getCriterion(SalesPO.COLUMN_INSTORERID_STR, data, op));
				} else if ("salesman".equals(field)) {
					query.add(query.getCriterion(SalesPO.COLUMN_SALESMANUSERID_STR, data, op));
				}else if ("guider".equals(field)) {
					query.add(query.getCriterion(SalesPO.COLUMN_GUIDERUSERID_STR, data, op));
				} else if (SalesPO.COLUMN_DOMPANY_STR.equals(field)) {
					int cid = CompanyServiceImpl.decode(filter.getData());
					query.add(query.getCriterion(SalesPO.COLUMN_DOMPANY_STR, cid, op));
				} else if (SalesPO.COLUMN_FULLPAYTIME_RANGE_STR.equals(field)) {
					query.timeranges(SalesPO.COLUMN_FULLPAYTIME_RANGE_STR, filter.getData());
				} else if (SalesPO.COLUMN_DEPT_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (SalesPO.COLUMN_FULLPAYTIME_STR.equals(field)) {
					query.timeranges(SalesPO.COLUMN_FULLPAYTIME_STR, filter.getData());
				}else if (SalesPO.COLUMN_CREATETIME_STR.equals(field)) {
					query.timeranges(SalesPO.COLUMN_CREATETIME_STR, filter.getData());
				}
			}
		}
	}

}
