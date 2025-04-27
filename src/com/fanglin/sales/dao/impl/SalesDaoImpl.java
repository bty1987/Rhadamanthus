package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
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
		query.add(Restrictions.or(query.getCriterion(SalesPO.COLUMN_OCUID_STR, uid, "eq"), query.alias("brand", "brand").getCriterion("brand.supplier.uid", uid, "eq")));

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

	@Override
	public long amountSales(String orderId, short type) {

		String sql = "select sum(s.amount) from sales.sales s where s.orderId = :orderId and s.type = :type and status in :status and balanceStatus = :balanceStatus";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).setParameterList("status", Arrays.asList(SalesPO.STATUS_INIT_SHORT, SalesPO.STATUS_END_SHORT)).setShort("balanceStatus", SalesPO.BALANCESTATUS_SETTLEMENT_SHORT).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	private void queryFilterExcute(PagingQuery<SalesPO> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, "");
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		if (prefix == null) {
			prefix = "";
		}

		if (!"".equals(prefix)) {

			query.alias(prefix, prefix);
			prefix = String.format("%s.", prefix);
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("house")) {
				query.alias(String.format("%shouse", prefix), "house");
			} else if (field.contains("village")) {
				query.alias(String.format("%shouse", prefix), "house");
				query.alias("house.village", "village");
			} else if (field.contains("instorer")) {
				query.alias(String.format("%sinstorer", prefix), "instorer");
			} else if (field.contains("salesman")) {
				query.alias(String.format("%ssalesman", prefix), "salesman");
			} else if (field.contains("guider")) {
				query.alias(String.format("%sguider", prefix), "guider");
			} else if (field.contains("region")) {
				query.alias(String.format("%sregion", prefix), "region");
			} else if (field.contains("dept")) {
				query.alias(String.format("%sdept", prefix), "dept");
			} else if (field.contains("department")) {
				query.alias(String.format("%sdept", prefix), "dept");
			}else if (field.contains("brand")) {
				query.alias(String.format("%sbrand", prefix), "brand");
			}

			if ("sales.no".equals(field)) {
				query.add(query.getCriterion(String.format("%sno", prefix), data, op));
			} else if ("sales.orderId".equals(field)) {
				query.add(query.getCriterion(String.format("%sorderId", prefix), data, op));
			} else if ("sales.house.houseNumber".equals(field)) {
				query.add(query.getCriterion("house.houseNumber", data, op));
			} else if ("sales.village.no".equals(field)) {
				query.add(query.getCriterion("village.no", data, op));
			} else if ("sales.grade".equals(field)) {
				query.add(query.getCriterion(String.format("%sgrade", prefix), data, op));
			} else if ("sales.brand.name".equals(field)) {
				query.add(query.getCriterion("brand.name", data, op));
			} else if ("sales.category".equals(field)) {
				query.add(query.getCriterion(String.format("%scategory", prefix), data, op));
			} else if ("brand.bid".equals(field)) {
				query.add(query.getCriterion("brand.bid", Long.valueOf(data), op));
			} else if ("sales.status".equals(field)) {
				query.add(query.getCriterion(String.format("%sstatus", prefix), Short.valueOf(data), op));
			} else if ("sales.type".equals(field)) {
				query.add(query.getCriterion(String.format("%stype", prefix), Short.valueOf(data), op));
			} else if ("sales.fullpayStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%sfullpayStatus", prefix), Short.valueOf(data), op));
			} else if ("sales.isAffirm".equals(field)) {
				query.add(query.getCriterion(String.format("%sisAffirm", prefix), Short.valueOf(data), op));
			} else if ("sales.balanceStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%sbalanceStatus", prefix), Short.valueOf(data), op));
			} else if ("sales.instorer.userId".equals(field)) {
				query.add(query.getCriterion("instorer.userId", data, op));
			} else if ("sales.salesman.userId".equals(field)) {
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if ("sales.guider.userId".equals(field)) {
				query.add(query.getCriterion("guider.userId", data, op));
			} else if ("sales.department.name".equals(field)) {
				query.add(query.getCriterion("dept.name", data, op));
			} else if ("sales.region.name".equals(field)) {
				query.add(query.getCriterion("region.name", data, op));
			} else if ("sales.fullpayTime.range".equals(field)) {
				query.timeranges(String.format("%sfullpayTime", prefix), filter.getData());
			} else if ("sales.affirmTime.range".equals(field)) {
				query.timeranges(String.format("%saffirmTime", prefix), filter.getData());
			} else if ("sales.createTime.range".equals(field)) {
				query.timeranges("createTime", filter.getData());
			} else if ("sales.dompany".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			} else if ("sales.company".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			} else if ("sales.pompany".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			}
		}
	}
}
