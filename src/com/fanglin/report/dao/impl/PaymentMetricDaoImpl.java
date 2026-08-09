package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.PaymentMetricDao;
import com.fanglin.report.po.PaymentDailyMetricPO;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 财务收款指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 payment.receipt（统一收据流水），按 collectTime/company/type/paymentType 分组，
 * 幂等写入本表。查询方法按 startTime/endTime 过滤。
 */
@Repository("paymentMetricDao")
public class PaymentMetricDaoImpl extends DaoImpl<PaymentDailyMetricPO> implements PaymentMetricDao {

	public PaymentMetricDaoImpl() {
		super(PaymentDailyMetricPO.class);
	}

	@Override
	public void rebuild() {

		StringBuilder sql = new StringBuilder();
		sql.append("INSERT INTO report.metric_payment_daily ");
		sql.append("(stat_date, company, type, payment_type, count, amount) ");
		sql.append("SELECT ");
		sql.append("  DATE_FORMAT(r.collectTime, '%Y-%m-%d') AS stat_date, ");
		sql.append("  r.company, ");
		sql.append("  r.type, ");
		sql.append("  r.paymentType, ");
		sql.append("  COUNT(*) AS count, ");
		sql.append("  IFNULL(SUM(r.money), 0) AS amount ");
		sql.append("FROM payment.receipt r ");
		sql.append("WHERE r.collectTime IS NOT NULL AND r.company > 0 ");
		sql.append("GROUP BY stat_date, r.company, r.type, r.paymentType ");
		sql.append("ON DUPLICATE KEY UPDATE count = VALUES(count), amount = VALUES(amount) ");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricTrendVO> queryCollectTrend(List<Filter> filters, int company) {
		return queryTrend(filters, company, 0); // type=0 收款
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricTrendVO> queryRefundTrend(List<Filter> filters, int company) {
		return queryTrend(filters, company, 1); // type=1 退款
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricTrendVO> queryNetTrend(List<Filter> filters, int company) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT DATE_FORMAT(stat_date, '%Y-%m') AS date, ");
		sql.append("  SUM(IF(type = 0, amount, -amount)) AS amount ");
		sql.append("FROM report.metric_payment_daily ");
		sql.append("WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY date ORDER BY date ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING).addScalar("amount", StandardBasicTypes.LONG);

		return toTrend(query.list());
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryPaymentTypeDist(List<Filter> filters, int company) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT CASE payment_type ");
		sql.append("  WHEN 0 THEN '预付款' WHEN 1 THEN '装修款' WHEN 2 THEN '主材款' ELSE '其他' END AS name, ");
		sql.append("  SUM(amount) AS value ");
		sql.append("FROM report.metric_payment_daily ");
		sql.append("WHERE company = :company AND type = 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY payment_type ORDER BY value DESC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING).addScalar("value", StandardBasicTypes.LONG);

		return toPoints(query.list());
	}

	// ---- 内部方法 ----

	@SuppressWarnings("unchecked")
	private List<MetricTrendVO> queryTrend(List<Filter> filters, int company, int type) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT DATE_FORMAT(stat_date, '%Y-%m') AS date, SUM(amount) AS amount ");
		sql.append("FROM report.metric_payment_daily ");
		sql.append("WHERE company = :company AND type = :type");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY date ORDER BY date ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.setInteger("type", type);
		query.addScalar("date", StandardBasicTypes.STRING).addScalar("amount", StandardBasicTypes.LONG);

		return toTrend(query.list());
	}

	private String[] parseDateRange(List<Filter> filters) {

		String startTime = null;
		String endTime = null;

		if (filters != null) {
			for (Filter filter : filters) {
				if ("startTime".equals(filter.getField())) {
					startTime = filter.getData();
				} else if ("endTime".equals(filter.getField())) {
					endTime = filter.getData();
				}
			}
		}
		return new String[] { startTime, endTime };
	}

	private String rangeClause(String[] range) {
		StringBuilder sb = new StringBuilder();
		if (range[0] != null) {
			sb.append(" AND stat_date >= '").append(range[0]).append("'");
		}
		if (range[1] != null) {
			sb.append(" AND stat_date <= '").append(range[1]).append("'");
		}
		return sb.toString();
	}

	@SuppressWarnings("unchecked")
	private List<MetricTrendVO> toTrend(List<Object[]> rows) {
		List<MetricTrendVO> result = new ArrayList<MetricTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricTrendVO((String) row[0], ((Number) row[1]).longValue()));
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	private List<MetricPointVO> toPoints(List<Object[]> rows) {
		List<MetricPointVO> result = new ArrayList<MetricPointVO>();
		for (Object[] row : rows) {
			result.add(new MetricPointVO((String) row[0], ((Number) row[1]).longValue()));
		}
		return result;
	}

}
