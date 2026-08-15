package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.FundsMetricDao;
import com.fanglin.report.po.FundsMonthlyMetricPO;
import com.fanglin.report.vo.FundsTrendVO;

/**
 * 资金闭环指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 两条 SQL：
 * ① quotation(默认报价) JOIN decoration(签约单) 按 contractTime 归月 → 总报价额/总签约额；
 * ② payment.receipt 按 collectTime 归月 → 总收款/总退款。
 */
@Repository("fundsMetricDao")
public class FundsMetricDaoImpl extends DaoImpl<FundsMonthlyMetricPO> implements FundsMetricDao {

	public FundsMetricDaoImpl() {
		super(FundsMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		// ① 报价额 + 签约额（按签约月）
		StringBuilder sql1 = new StringBuilder();
		sql1.append("INSERT INTO report.metric_funds_monthly ");
		sql1.append("(stat_month, company, quotation_total, sign_total, collect_total, refund_total) ");
		sql1.append("SELECT ");
		sql1.append("  DATE_FORMAT(d.contractTime, '%Y-%m') AS stat_month, ");
		sql1.append("  d.company, ");
		sql1.append("  IFNULL(SUM(q.totalPrice), 0) AS quotation_total, ");
		sql1.append("  IFNULL(SUM(d.orderTotalPrice), 0) AS sign_total, ");
		sql1.append("  0, 0 ");
		sql1.append("FROM quotation.quotation q ");
		sql1.append("INNER JOIN decoration.decoration d ON q.orderId = d.orderId ");
		sql1.append("WHERE q.defaults = 1 AND d.status >= 3 AND d.contractTime IS NOT NULL AND d.company > 0 ");
		sql1.append("  AND q.totalPrice > 0 ");
		sql1.append("GROUP BY stat_month, d.company ");
		sql1.append("ON DUPLICATE KEY UPDATE ");
		sql1.append("  quotation_total = VALUES(quotation_total), sign_total = VALUES(sign_total) ");
		session().createSQLQuery(sql1.toString()).executeUpdate();

		// ② 收款 + 退款（按收款月）
		StringBuilder sql2 = new StringBuilder();
		sql2.append("INSERT INTO report.metric_funds_monthly ");
		sql2.append("(stat_month, company, quotation_total, sign_total, collect_total, refund_total) ");
		sql2.append("SELECT ");
		sql2.append("  DATE_FORMAT(r.collectTime, '%Y-%m') AS stat_month, ");
		sql2.append("  r.company, 0, 0, ");
		sql2.append("  IFNULL(SUM(IF(r.type = 0, r.money, 0)), 0) AS collect_total, ");
		sql2.append("  IFNULL(SUM(IF(r.type = 1, r.money, 0)), 0) AS refund_total ");
		sql2.append("FROM payment.receipt r ");
		sql2.append("WHERE r.collectTime IS NOT NULL AND r.company > 0 ");
		sql2.append("GROUP BY stat_month, r.company ");
		sql2.append("ON DUPLICATE KEY UPDATE ");
		sql2.append("  collect_total = VALUES(collect_total), refund_total = VALUES(refund_total) ");
		session().createSQLQuery(sql2.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FundsTrendVO> queryFundsTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  SUM(quotation_total) AS quotationTotal, SUM(sign_total) AS signTotal, ");
		sql.append("  SUM(collect_total) AS collectTotal, SUM(refund_total) AS refundTotal ");
		sql.append("FROM report.metric_funds_monthly ");
		sql.append("WHERE company = :company AND (quotation_total > 0 OR collect_total > 0)");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("quotationTotal", StandardBasicTypes.LONG);
		query.addScalar("signTotal", StandardBasicTypes.LONG);
		query.addScalar("collectTotal", StandardBasicTypes.LONG);
		query.addScalar("refundTotal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<FundsTrendVO> result = new ArrayList<FundsTrendVO>();
		for (Object[] row : rows) {
			FundsTrendVO vo = new FundsTrendVO();
			vo.setDate((String) row[0]);
			vo.setQuotationTotal(toLong(row[1]));
			vo.setSignTotal(toLong(row[2]));
			vo.setCollectTotal(toLong(row[3]));
			vo.setRefundTotal(toLong(row[4]));
			result.add(vo);
		}
		return result;
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

	private long toLong(Object obj) {
		return obj == null ? 0L : ((Number) obj).longValue();
	}

}
