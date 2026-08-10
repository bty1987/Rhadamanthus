package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.CustomerMetricDao;
import com.fanglin.report.po.CustomerMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 客户获客指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 customer.customersource，按 createTime 归月，
 * 按 status 统计报备/确认/转单/失效，按 source 分渠道。空来源归"未分类"。
 */
@Repository("customerMetricDao")
public class CustomerMetricDaoImpl extends DaoImpl<CustomerMonthlyMetricPO> implements CustomerMetricDao {

	public CustomerMetricDaoImpl() {
		super(CustomerMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		StringBuilder sql = new StringBuilder();
		sql.append("INSERT INTO report.metric_customer_monthly ");
		sql.append("(stat_month, company, source, total_count, confirm_count, convert_count, invalid_count) ");
		sql.append("SELECT ");
		sql.append("  DATE_FORMAT(cs.createTime, '%Y-%m') AS stat_month, ");
		sql.append("  cs.company, ");
		sql.append("  IFNULL(NULLIF(cs.source, ''), '未分类') AS source, ");
		sql.append("  COUNT(*) AS total_count, ");
		sql.append("  SUM(IF(cs.status >= 3, 1, 0)) AS confirm_count, ");
		sql.append("  SUM(IF(cs.status = 5, 1, 0)) AS convert_count, ");
		sql.append("  SUM(IF(cs.status = 1, 1, 0)) AS invalid_count ");
		sql.append("FROM customer.customersource cs ");
		sql.append("WHERE cs.createTime IS NOT NULL AND cs.company > 0 ");
		sql.append("GROUP BY stat_month, cs.company, source ");
		sql.append("ON DUPLICATE KEY UPDATE ");
		sql.append("  total_count = VALUES(total_count), confirm_count = VALUES(confirm_count), ");
		sql.append("  convert_count = VALUES(convert_count), invalid_count = VALUES(invalid_count) ");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> queryFunnelTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  SUM(total_count) AS totalVal, SUM(confirm_count) AS confirmVal ");
		sql.append("FROM report.metric_customer_monthly ");
		sql.append("WHERE company = :company AND total_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("totalVal", StandardBasicTypes.LONG);
		query.addScalar("confirmVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], ((Number) row[1]).longValue(), ((Number) row[2]).longValue()));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> querySourceDist(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT source AS name, SUM(total_count) AS value ");
		sql.append("FROM report.metric_customer_monthly ");
		sql.append("WHERE company = :company AND total_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY source ORDER BY value DESC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING).addScalar("value", StandardBasicTypes.LONG);

		return toPoints(query.list());
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryConvertTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS name, SUM(convert_count) AS value ");
		sql.append("FROM report.metric_customer_monthly ");
		sql.append("WHERE company = :company AND total_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

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
