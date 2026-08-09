package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ConstructionMetricDao;
import com.fanglin.report.po.ConstructionMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 施工履约指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 三表 JOIN：construction(constructioninfo) + decoration(取 company)。
 * 两条 SQL 分别按 startTime(开工量+工期+在建+超期) 和 finishTime(完工量) 归月。
 */
@Repository("constructionMetricDao")
public class ConstructionMetricDaoImpl extends DaoImpl<ConstructionMonthlyMetricPO> implements ConstructionMetricDao {

	public ConstructionMetricDaoImpl() {
		super(ConstructionMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		// ① 开工量 + 在建数 + 工期 + 超期（按 startTime 归月）
		StringBuilder sql1 = new StringBuilder();
		sql1.append("INSERT INTO report.metric_construction_monthly ");
		sql1.append("(stat_month, company, start_count, finish_count, ongoing_count, ");
		sql1.append(" avg_actual_period, avg_plan_period, overdue_count) ");
		sql1.append("SELECT ");
		sql1.append("  DATE_FORMAT(c.startTime, '%Y-%m') AS stat_month, ");
		sql1.append("  d.company, ");
		sql1.append("  COUNT(*) AS start_count, ");
		sql1.append("  0 AS finish_count, ");
		sql1.append("  SUM(IF(c.process = 0, 1, 0)) AS ongoing_count, ");
		sql1.append("  IFNULL(AVG(ci.actuaTime), 0) AS avg_actual_period, ");
		sql1.append("  IFNULL(AVG(ci.timeLimit), 0) AS avg_plan_period, ");
		sql1.append("  SUM(IF(ci.actuaTime > ci.timeLimit AND ci.actuaTime > 0, 1, 0)) AS overdue_count ");
		sql1.append("FROM construction.construction c ");
		sql1.append("INNER JOIN decoration.decoration d ON c.orderId = d.orderId ");
		sql1.append("LEFT JOIN construction.constructioninfo ci ON c.orderId = ci.orderId ");
		sql1.append("WHERE c.startTime IS NOT NULL AND d.company > 0 ");
		sql1.append("GROUP BY stat_month, d.company ");
		sql1.append("ON DUPLICATE KEY UPDATE ");
		sql1.append("  start_count = VALUES(start_count), ongoing_count = VALUES(ongoing_count), ");
		sql1.append("  avg_actual_period = VALUES(avg_actual_period), avg_plan_period = VALUES(avg_plan_period), ");
		sql1.append("  overdue_count = VALUES(overdue_count) ");

		session().createSQLQuery(sql1.toString()).executeUpdate();

		// ② 完工量（按 finishTime 归月）
		StringBuilder sql2 = new StringBuilder();
		sql2.append("INSERT INTO report.metric_construction_monthly ");
		sql2.append("(stat_month, company, start_count, finish_count, ongoing_count, ");
		sql2.append(" avg_actual_period, avg_plan_period, overdue_count) ");
		sql2.append("SELECT ");
		sql2.append("  DATE_FORMAT(c.finishTime, '%Y-%m') AS stat_month, ");
		sql2.append("  d.company, 0, ");
		sql2.append("  COUNT(*) AS finish_count, 0, 0, 0, 0 ");
		sql2.append("FROM construction.construction c ");
		sql2.append("INNER JOIN decoration.decoration d ON c.orderId = d.orderId ");
		sql2.append("WHERE c.finishTime IS NOT NULL AND c.process = 1 AND d.company > 0 ");
		sql2.append("GROUP BY stat_month, d.company ");
		sql2.append("ON DUPLICATE KEY UPDATE finish_count = VALUES(finish_count) ");

		session().createSQLQuery(sql2.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> queryStartFinishTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  start_count AS startVal, finish_count AS finishVal ");
		sql.append("FROM report.metric_construction_monthly ");
		sql.append("WHERE company = :company AND (start_count > 0 OR finish_count > 0)");
		sql.append(rangeClause(range));
		sql.append(" ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("startVal", StandardBasicTypes.LONG);
		query.addScalar("finishVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], ((Number) row[1]).longValue(), ((Number) row[2]).longValue()));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> queryPeriodTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  avg_actual_period AS actualVal, avg_plan_period AS planVal ");
		sql.append("FROM report.metric_construction_monthly ");
		sql.append("WHERE company = :company AND start_count > 0");
		sql.append(rangeClause(range));
		sql.append(" ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("actualVal", StandardBasicTypes.LONG);
		query.addScalar("planVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], ((Number) row[1]).longValue(), ((Number) row[2]).longValue()));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryOverdueDist(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS name, ");
		sql.append("  overdue_count AS value, ");
		sql.append("  start_count, finish_count ");
		sql.append("FROM report.metric_construction_monthly ");
		sql.append("WHERE company = :company AND start_count > 0");
		sql.append(rangeClause(range));
		sql.append(" ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING);
		query.addScalar("value", StandardBasicTypes.LONG);

		return toPoints(query.list());
	}

	// ---- 工具方法 ----

	private String[] parseMonthRange(List<Filter> filters) {

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
			sb.append(" AND stat_month >= '").append(range[0].substring(0, 7)).append("'");
		}
		if (range[1] != null) {
			sb.append(" AND stat_month <= '").append(range[1].substring(0, 7)).append("'");
		}
		return sb.toString();
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
