package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.SalesMetricDao;
import com.fanglin.report.po.SalesMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 主材销售指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 sales.sales，按 createTime 归月，排除作废单（status != 4）。
 * 空品类归为"未分类"。
 */
@Repository("salesMetricDao")
public class SalesMetricDaoImpl extends DaoImpl<SalesMonthlyMetricPO> implements SalesMetricDao {

	public SalesMetricDaoImpl() {
		super(SalesMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		StringBuilder sql = new StringBuilder();
		sql.append("INSERT INTO report.metric_sales_monthly ");
		sql.append("(stat_month, company, category, sales_count, total_amount) ");
		sql.append("SELECT ");
		sql.append("  DATE_FORMAT(s.createTime, '%Y-%m') AS stat_month, ");
		sql.append("  s.company, ");
		sql.append("  IFNULL(NULLIF(s.category, ''), '未分类') AS category, ");
		sql.append("  COUNT(*) AS sales_count, ");
		sql.append("  IFNULL(SUM(s.total), 0) AS total_amount ");
		sql.append("FROM sales.sales s ");
		sql.append("WHERE s.createTime IS NOT NULL AND s.company > 0 AND s.status NOT IN (4) ");
		sql.append("GROUP BY stat_month, s.company, category ");
		sql.append("ON DUPLICATE KEY UPDATE ");
		sql.append("  sales_count = VALUES(sales_count), total_amount = VALUES(total_amount) ");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> querySalesTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  SUM(sales_count) AS countVal, SUM(total_amount) AS amountVal ");
		sql.append("FROM report.metric_sales_monthly ");
		sql.append("WHERE company = :company AND sales_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("countVal", StandardBasicTypes.LONG);
		query.addScalar("amountVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], ((Number) row[1]).longValue(), ((Number) row[2]).longValue()));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryCategoryDist(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT category AS name, SUM(total_amount) AS value ");
		sql.append("FROM report.metric_sales_monthly ");
		sql.append("WHERE company = :company AND sales_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY category ORDER BY value DESC ");

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

	@SuppressWarnings("unchecked")
	private List<MetricPointVO> toPoints(List<Object[]> rows) {
		List<MetricPointVO> result = new ArrayList<MetricPointVO>();
		for (Object[] row : rows) {
			result.add(new MetricPointVO((String) row[0], ((Number) row[1]).longValue()));
		}
		return result;
	}

}
