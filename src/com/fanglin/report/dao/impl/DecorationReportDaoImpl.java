package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.report.dao.DecorationReportDao;
import com.fanglin.report.po.DecorationAchievementPO;
import com.fanglin.report.po.DecorationReportPO;
import com.fanglin.utils.Paging;

@Repository("DecorationReportDao")
public class DecorationReportDaoImpl extends DaoImpl<DecorationReportPO> implements DecorationReportDao {

	public DecorationReportDaoImpl() {
		super(DecorationReportPO.class);
	}

	@Override
	public List<DecorationReportPO> queryDecoration7Construction(Paging paging, List<Filter> filters) {

		PagingQuery<DecorationReportPO> query = pagingQuery(paging, DecorationReportPO.class);

		return query.list();
	}

	@Override
	public List<DecorationAchievementPO> queryDecoration7Achievement(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationAchievementPO> query = pagingQuery(new Paging(), DecorationAchievementPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForConstruction() {

		String sql = "SELECT company, projectStatus, COUNT(*) as count FROM decoration.decoration GROUP BY company, projectStatus";
		SQLQuery query = session().createSQLQuery(sql.toString()).addScalar("company", StandardBasicTypes.INTEGER).addScalar("projectStatus", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForContract(List<Integer> year) {

		StringBuffer sql = new StringBuffer();
		sql.append("SELECT company, year - 2001 AS type, COUNT(*) AS count FROM (");
		sql.append("SELECT company, YEAR(contractTime) AS year FROM decoration.decoration WHERE YEAR(contractTime) IN (:year) AND status = :status");
		sql.append(")a GROUP BY company,year");

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setShort("status", DecorationPO.STATUS_SIGNED_INT).setParameterList("year", year);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar("type", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForPaySacle(int min, Integer max, Integer type) {

		String sql = "SELECT company,:type,COUNT(*) AS count FROM decoration.decoration WHERE paySacle between :min AND :max  GROUP BY company";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setInteger("min", min).setInteger("max", max).setInteger("type", type);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar(String.valueOf(type), StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForDesignStatus(List<Short> designStatus) {
		String sql = "SELECT company, designStatus + 23 AS type, COUNT(*) as count FROM decoration.decoration WHERE designStatus IN (:designStatus) GROUP BY company, designStatus";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setParameterList("designStatus", designStatus);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar("type", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForDeposit(short deposit) {
		String sql = "SELECT company, 26, COUNT(*) as count FROM decoration.decoration  WHERE status =:deposit  GROUP BY  company, status";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setShort("deposit", deposit);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar("26", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);

		return query.list();
	}

	@Override
	public void truncateDecoration7Construction() {

		String sql = " TRUNCATE TABLE report.decoration4construction";
		SQLQuery query = session().createSQLQuery(sql);
		query.executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement1(String startTime, String endTime, int company) {
		String sql = "select dr.did AS did, count(*) AS cs0, sum(d.orderTotalPrice) AS cs2, sum(orderTotalPrice - (q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate) - couponCut - thingCut) AS cs3 from decoration.decoration d, quotation.quotation q, communion.user du, communion.department dd, communion.department dr where d.contractTime > :startTime and d.contractTime < :endTime and d.company = :company and d.orderId = q.orderId and q.defaults = 1 and d.dsuid = du.uid and du.deptid = dd.did and dd.fdid = dr.did group by dr.did;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("cs0", StandardBasicTypes.INTEGER).addScalar("cs2", StandardBasicTypes.LONG).addScalar("cs3", StandardBasicTypes.LONG);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement2(String startTime, String endTime, int company) {
		String sql = "select dr.did AS did, count(*) AS cs1, sum(dp.refermoney) AS cs4 from payment.decorationpayment dp, payment.decorationreceipt dr, decoration.decoration d, communion.user du, communion.department dd, communion.department dr where dp.drid = dr.drid and dr.collectTime > :startTime and dr.collectTime < :endTime and dp.company = :company and dp.orderId = d.orderId and d.dsuid = du.uid and du.deptid = dd.did and dd.fdid = dr.did group by dr.did;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("cs1", StandardBasicTypes.INTEGER).addScalar("cs4", StandardBasicTypes.LONG);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement3(String startTime, String endTime, int company) {
		String sql = "select dr.did AS did, sum(sp.serviceMoney) AS cs5 from payment.servicepayment sp, payment.servicereceipt sr, decoration.decoration d, communion.user du, communion.department dd, communion.department dr where sp.srid = sr.srid and sr.collectTime > :startTime and sr.collectTime < :endTime and sp.company = :company and sp.orderId = d.orderId and d.dsuid = du.uid and du.deptid = dd.did and dd.fdid = dr.did group by dr.did;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("cs5", StandardBasicTypes.LONG);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement4(String startTime, String endTime, int company) {
		String sql = "select sr.did AS did, count(*) AS cs0, sum(d.orderTotalPrice) AS cs2, sum(orderTotalPrice - (q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate) - couponCut - thingCut) AS cs3 from decoration.decoration d, quotation.quotation q, communion.user su, communion.department sd, communion.department sr where d.contractTime > :startTime and d.contractTime < :endTime and d.company = :company and d.orderId = q.orderId and q.defaults = 1 and d.smuid = su.uid and su.deptid = sd.did and sd.fdid = sr.did group by sr.did;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("cs0", StandardBasicTypes.INTEGER).addScalar("cs2", StandardBasicTypes.LONG).addScalar("cs3", StandardBasicTypes.LONG);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement5(String startTime, String endTime, int company) {
		String sql = "select sr.did AS did, count(*) cs1, sum(dp.refermoney) AS cs4 from payment.decorationpayment dp, payment.decorationreceipt dr, decoration.decoration d, communion.user su, communion.department sd, communion.department sr where dp.drid = dr.drid and dr.collectTime > :startTime and dr.collectTime < :endTime and dp.company = :company and dp.orderId = d.orderId and d.smuid = su.uid and su.deptid = sd.did and sd.fdid = sr.did group by sr.did;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("cs1", StandardBasicTypes.INTEGER).addScalar("cs4", StandardBasicTypes.LONG);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement6(String startTime, String endTime, int company) {
		String sql = "select sr.did AS did, sum(sp.serviceMoney) AS cs5 from payment.servicepayment sp, payment.servicereceipt sr, decoration.decoration d, communion.user su, communion.department sd, communion.department sr where sp.srid = sr.srid and sr.collectTime > :startTime and sr.collectTime < :endTime and sp.company = :company and sp.orderId = d.orderId and d.smuid = su.uid and su.deptid = sd.did and sd.fdid = sr.did group by sr.did;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("cs5", StandardBasicTypes.LONG);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();

				if ("year".equals(field)) {
					query.add(Restrictions.eq("year", Integer.valueOf(data)));
				} else if ("month".equals(field)) {
					query.add(Restrictions.eq("month", Integer.valueOf(data)));
				}
			}
		}
	}

}