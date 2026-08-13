package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.SalaryMetricDao;
import com.fanglin.report.po.SalaryMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 人力薪酬指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 salary.workersalary，按 createTime 归月，仅统计 status=1（通过）。
 */
@Repository("salaryMetricDao")
public class SalaryMetricDaoImpl extends DaoImpl<SalaryMonthlyMetricPO> implements SalaryMetricDao {

	public SalaryMetricDaoImpl() {
		super(SalaryMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		StringBuilder sql = new StringBuilder();
		sql.append("INSERT INTO report.metric_salary_monthly ");
		sql.append("(stat_month, company, twotype, salary_count, total_salary) ");
		sql.append("SELECT ");
		sql.append("  DATE_FORMAT(ws.createTime, '%Y-%m') AS stat_month, ");
		sql.append("  ws.company, ");
		sql.append("  ws.twotype, ");
		sql.append("  COUNT(*) AS salary_count, ");
		sql.append("  IFNULL(SUM(ws.salary), 0) AS total_salary ");
		sql.append("FROM salary.workersalary ws ");
		sql.append("WHERE ws.createTime IS NOT NULL AND ws.company > 0 AND ws.status = 1 ");
		sql.append("GROUP BY stat_month, ws.company, ws.twotype ");
		sql.append("ON DUPLICATE KEY UPDATE ");
		sql.append("  salary_count = VALUES(salary_count), total_salary = VALUES(total_salary) ");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> querySalaryTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  SUM(salary_count) AS countVal, SUM(total_salary) AS salaryVal ");
		sql.append("FROM report.metric_salary_monthly ");
		sql.append("WHERE company = :company AND salary_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("countVal", StandardBasicTypes.LONG);
		query.addScalar("salaryVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], toLong(row[1]), toLong(row[2])));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryWorkerTypeDist(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT CASE twotype ");
		sql.append("  WHEN 1 THEN '工费' WHEN 2 THEN '增项' WHEN 3 THEN '油工奖励' WHEN 4 THEN '维修款' ");
		sql.append("  WHEN 11 THEN '预支' WHEN 12 THEN '家属保险' WHEN 13 THEN '罚款' WHEN 14 THEN '工程质保金' ");
		sql.append("  ELSE '其他' END AS name, ");
		sql.append("  SUM(total_salary) AS value ");
		sql.append("FROM report.metric_salary_monthly ");
		sql.append("WHERE company = :company AND salary_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY twotype ORDER BY value DESC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING).addScalar("value", StandardBasicTypes.LONG);

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

	private List<MetricPointVO> toPoints(List<Object[]> rows) {
		List<MetricPointVO> result = new ArrayList<MetricPointVO>();
		for (Object[] row : rows) {
			result.add(new MetricPointVO((String) row[0], toLong(row[1])));
		}
		return result;
	}

	private long toLong(Object obj) {
		return obj == null ? 0L : ((Number) obj).longValue();
	}

}
