package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.QuotationMetricDao;
import com.fanglin.report.po.QuotationMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;

/**
 * 报价偏差指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 quotation.quotation（默认报价）+ decoration.decoration（签约单），
 * 按 contractTime 归月，统计平均报价额 vs 平均签约额。
 */
@Repository("quotationMetricDao")
public class QuotationMetricDaoImpl extends DaoImpl<QuotationMonthlyMetricPO> implements QuotationMetricDao {

	public QuotationMetricDaoImpl() {
		super(QuotationMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		StringBuilder sql = new StringBuilder();
		sql.append("INSERT INTO report.metric_quotation_monthly ");
		sql.append("(stat_month, company, quotation_count, avg_quotation_amount, avg_sign_amount, avg_diff_amount) ");
		sql.append("SELECT ");
		sql.append("  DATE_FORMAT(d.contractTime, '%Y-%m') AS stat_month, ");
		sql.append("  d.company, ");
		sql.append("  COUNT(*) AS quotation_count, ");
		sql.append("  IFNULL(AVG(q.totalPrice), 0) AS avg_quotation_amount, ");
		sql.append("  IFNULL(AVG(d.orderTotalPrice), 0) AS avg_sign_amount, ");
		sql.append("  IFNULL(AVG(d.orderTotalPrice - q.totalPrice), 0) AS avg_diff_amount ");
		sql.append("FROM quotation.quotation q ");
		sql.append("INNER JOIN decoration.decoration d ON q.orderId = d.orderId ");
		sql.append("WHERE q.defaults = 1 AND d.status >= 3 AND d.contractTime IS NOT NULL AND d.company > 0 ");
		sql.append("  AND q.totalPrice > 0 ");
		sql.append("GROUP BY stat_month, d.company ");
		sql.append("ON DUPLICATE KEY UPDATE ");
		sql.append("  quotation_count = VALUES(quotation_count), ");
		sql.append("  avg_quotation_amount = VALUES(avg_quotation_amount), ");
		sql.append("  avg_sign_amount = VALUES(avg_sign_amount), ");
		sql.append("  avg_diff_amount = VALUES(avg_diff_amount) ");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> queryQuotationSignTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  avg_quotation_amount AS quoteVal, avg_sign_amount AS signVal ");
		sql.append("FROM report.metric_quotation_monthly ");
		sql.append("WHERE company = :company AND quotation_count > 0");
		sql.append(rangeClause(range));
		sql.append(" ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("quoteVal", StandardBasicTypes.LONG);
		query.addScalar("signVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], toLong(row[1]), toLong(row[2])));
		}
		return result;
	}

	/** 安全转 long，null 返回 0。SQL 聚合(SUM)无匹配行时返回 NULL。 */
	private long toLong(Object obj) {
		return obj == null ? 0L : ((Number) obj).longValue();
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

}
