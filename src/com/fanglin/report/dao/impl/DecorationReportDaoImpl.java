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

		PagingQuery<DecorationAchievementPO> query = pagingQuery(paging, DecorationAchievementPO.class);

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

	// 签单户数,工程合同额,工程净业绩
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement1(String startTime, String endTime, int company) {
		String sql = "select regionds.did AS did, d.typeness AS typeness, sum(belongds.rate) AS cs0, sum(d.orderTotalPrice * (belongds.rate/1000)) AS cs2, sum((orderTotalPrice - ( q.managePrice / ( q.manageRate + d.notSalesmanRate ) * d.notSalesmanRate ) - couponCut - thingCut) * (belongds.rate/1000)) AS cs3 from decoration.decoration d, quotation.quotation q, communion.department regionds, decoration.decorationbelong belongds where d.contractTime > :startTime and d.contractTime < :endTime and regionds.company = :company and d.orderId = belongds.orderId and d.orderId = q.orderId and belongds.rid = regionds.dId and belongds.`status` = 0 and belongds.`type` = 0 and q.defaults = 1 group by regionds.did, d.typeness;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("typeness", StandardBasicTypes.SHORT).addScalar("cs0", StandardBasicTypes.LONG).addScalar("cs2", StandardBasicTypes.LONG).addScalar("cs3", StandardBasicTypes.LONG);

		return query.list();
	}

	// 设计户数,设计费
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement2(String startTime, String endTime, int company) {
		String sql = "select regionds.did AS did, d.typeness AS typeness, sum(belongds.rate) AS cs1, sum( dp.refermoney * (belongds.rate/1000)) AS cs4 from payment.decorationpayment dp, payment.decorationreceipt dr, decoration.decoration d, communion.department regionds, decoration.decorationbelong belongds, communion.PaymentType cp where dr.collectTime > :startTime and dr.collectTime < :endTime and regionds.company = :company and dp.drid = dr.drid and d.orderId = belongds.orderId and dp.orderId = d.orderId and belongds.rid = regionds.dId and belongds.`status` = 0 and belongds.`type` = 0 and dp.ptid = cp.ptid and cp.paytype = 0 and cp.bustype = 0 and cp.atttype = 0 and dp.paymentStatus in ( 1, 2 ) group by regionds.did, d.typeness;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("typeness", StandardBasicTypes.SHORT).addScalar("cs1", StandardBasicTypes.LONG).addScalar("cs4", StandardBasicTypes.LONG);

		return query.list();
	}

	// 服务费
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement3(String startTime, String endTime, int company) {
		String sql = "select regionds.did AS did, d.typeness AS typeness, sum( sp.serviceMoney * (belongds.rate/1000)) AS cs5 from payment.servicepayment sp, payment.servicereceipt sr, decoration.decoration d, communion.department regionds, decoration.decorationbelong belongds where sr.collectTime > :startTime and sr.collectTime < :endTime and regionds.company = :company and sp.srid = sr.srid and sp.orderId = d.orderId and d.orderId = belongds.orderId and belongds.rid = regionds.dId and belongds.`status` = 0 and belongds.`type` = 0 group by regionds.did, d.typeness;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("typeness", StandardBasicTypes.SHORT).addScalar("cs5", StandardBasicTypes.LONG);

		return query.list();
	}

	// 未签单设计户数,未签单设计户费
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForAchievement4(String startTime, String endTime, int company) {
		String sql = "select regionds.did AS did, d.typeness AS typeness, sum(belongds.rate) AS cs6, sum(dp.refermoney * (belongds.rate/1000)) AS cs7 from payment.decorationpayment dp, payment.decorationreceipt dr, decoration.decoration d, communion.department regionds, decoration.decorationbelong belongds, communion.PaymentType cp where dr.collectTime > :startTime and dr.collectTime < :endTime and regionds.company = :company  and dp.drid = dr.drid and d.orderId = belongds.orderId and dp.orderId = d.orderId and belongds.rid = regionds.dId and belongds.`status` = 0 and belongds.`type` = 0 and d.status not in (3, 7) and dp.ptid = cp.ptid and cp.paytype = 0 and cp.bustype = 0 and cp.atttype = 0 and dp.paymentStatus in (1, 2) group by regionds.did, d.typeness;";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString("startTime", startTime).setString("endTime", endTime).setInteger("company", company);
		query.addScalar("did", StandardBasicTypes.INTEGER).addScalar("typeness", StandardBasicTypes.SHORT).addScalar("cs6", StandardBasicTypes.LONG).addScalar("cs7", StandardBasicTypes.LONG);

		return query.list();
	}

	@Override
	public int updataDecoration7Achievement(int did, int year, int month, short typeness, long cs0, long cs1, long cs2, long cs3, long cs4, long cs5, long cs6, long cs7, int company) {

		String sql = "REPLACE INTO report.decoration7achievement (did, year, month, typeness, cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7, company) VALUES (:did, :year, :month, :typeness, :cs0, :cs1, :cs2, :cs3, :cs4, :cs5, :cs6, :cs7, :company);";
		session().createSQLQuery(sql).setInteger("did", did).setInteger("year", year).setInteger("month", month).setShort("typeness", typeness).setLong("cs0", cs0).setLong("cs1", cs1).setLong("cs2", cs2).setLong("cs3", cs3).setLong("cs4", cs4).setLong("cs5", cs5).setLong("cs6", cs6).setLong("cs7", cs7).setInteger("company", company).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("year".equals(field)) {
					query.add(Restrictions.eq("year", Integer.valueOf(data)));
				} else if ("month".equals(field)) {
					query.add(Restrictions.eq("month", Integer.valueOf(data)));
				} else if ("typeness".equals(field)) {
					query.add(query.getCriterion("typeness", Short.valueOf(data), op));
				}
			}
		}
	}

}