package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ApprovalMetricDao;
import com.fanglin.report.po.ApprovalMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 审批运营指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 approval.approval，按 createTime 归月。
 * 耗时基于 status=2（拒绝）的 approvalTime-createTime，单位小时取整。
 */
@Repository("approvalMetricDao")
public class ApprovalMetricDaoImpl extends DaoImpl<ApprovalMonthlyMetricPO> implements ApprovalMetricDao {

	public ApprovalMetricDaoImpl() {
		super(ApprovalMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		StringBuilder sql = new StringBuilder();
		sql.append("INSERT INTO report.metric_approval_monthly ");
		sql.append("(stat_month, company, type, total_count, reject_count, avg_duration_hours) ");
		sql.append("SELECT ");
		sql.append("  DATE_FORMAT(a.createTime, '%Y-%m') AS stat_month, ");
		sql.append("  a.company, ");
		sql.append("  a.type, ");
		sql.append("  COUNT(*) AS total_count, ");
		sql.append("  SUM(IF(a.status = 2, 1, 0)) AS reject_count, ");
		sql.append("  IFNULL(AVG(IF(a.status = 2, TIMESTAMPDIFF(HOUR, a.createTime, a.approvalTime), NULL)), 0) AS avg_duration_hours ");
		sql.append("FROM approval.approval a ");
		sql.append("WHERE a.createTime IS NOT NULL AND a.company > 0 ");
		sql.append("GROUP BY stat_month, a.company, a.type ");
		sql.append("ON DUPLICATE KEY UPDATE ");
		sql.append("  total_count = VALUES(total_count), reject_count = VALUES(reject_count), ");
		sql.append("  avg_duration_hours = VALUES(avg_duration_hours) ");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> queryApprovalTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  SUM(total_count) AS totalVal, SUM(reject_count) AS rejectVal ");
		sql.append("FROM report.metric_approval_monthly ");
		sql.append("WHERE company = :company AND total_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("totalVal", StandardBasicTypes.LONG);
		query.addScalar("rejectVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], toLong(row[1]), toLong(row[2])));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryTypeDist(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT CASE type ");
		sql.append("  WHEN 3 THEN '装修归属' WHEN 5 THEN '装修退款' WHEN 8 THEN '装修活动' ");
		sql.append("  WHEN 10 THEN '销售退款' WHEN 12 THEN '销售折扣' WHEN 14 THEN '客源T装修' ");
		sql.append("  WHEN 17 THEN '客源' WHEN 19 THEN '装修终止' WHEN 20 THEN '客户源' ");
		sql.append("  WHEN 23 THEN '促销优惠' ELSE '其他' END AS name, ");
		sql.append("  SUM(total_count) AS value ");
		sql.append("FROM report.metric_approval_monthly ");
		sql.append("WHERE company = :company AND total_count > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY type ORDER BY value DESC ");

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
