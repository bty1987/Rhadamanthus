package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.DecorationMetricDao;
import com.fanglin.report.po.DecorationDailyMetricPO;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 装修指标汇总 DAO 实现。
 * 
 * <p>
 * {@link #rebuild()} 跨库只读聚合 decoration.decoration，幂等写入本表。 两条 SQL 分别按 createTime（状态计数+类型）和 contractTime（签约额）归日。
 * 
 * <p>
 * 查询方法从 report.metric_decoration_daily 聚合，解析 {@code startTime/endTime} 过滤。
 */
@Repository("decorationMetricDao")
public class DecorationMetricDaoImpl extends DaoImpl<DecorationDailyMetricPO> implements DecorationMetricDao {

	public DecorationMetricDaoImpl() {
		super(DecorationDailyMetricPO.class);
	}

	/**
	 * 全量重算。按 createTime 归日统计各状态计数与类型分布，按 contractTime 归日统计签约额。 INSERT ... ON DUPLICATE KEY UPDATE 保证幂等（唯一键 stat_date+company）。
	 */
	@Override
	public void rebuild() {

		// ① 状态计数 + 类型分布（按 createTime 归日）
		StringBuilder sql1 = new StringBuilder();
		sql1.append("INSERT INTO report.metric_decoration_daily ");
		sql1.append("(stat_date, company, measure_count, deposit_count, presign_count, sign_count, resign_count, ");
		sql1.append(" final_count, complete_count, waste_count, termination_count, ");
		sql1.append(" midpack_count, inclusive_count, holonomy_count, sign_amount) ");
		sql1.append("SELECT ");
		sql1.append("  DATE_FORMAT(d.createTime, '%Y-%m-%d') AS stat_date, ");
		sql1.append("  d.company, ");
		sql1.append("  COUNT(*) AS measure_count, ");
		sql1.append("  SUM(IF(d.status >= 1, 1, 0)) AS deposit_count, ");
		sql1.append("  SUM(IF(d.status >= 2, 1, 0)) AS presign_count, ");
		sql1.append("  SUM(IF(d.status >= 3, 1, 0)) AS sign_count, ");
		sql1.append("  SUM(IF(d.status = 4, 1, 0)) AS resign_count, ");
		sql1.append("  SUM(IF(d.status >= 7, 1, 0)) AS final_count, ");
		sql1.append("  SUM(IF(d.status >= 8, 1, 0)) AS complete_count, ");
		sql1.append("  SUM(IF(d.status = 5, 1, 0)) AS waste_count, ");
		sql1.append("  SUM(IF(d.status = 6, 1, 0)) AS termination_count, ");
		sql1.append("  SUM(IF(d.type = 0, 1, 0)) AS midpack_count, ");
		sql1.append("  SUM(IF(d.type = 1, 1, 0)) AS inclusive_count, ");
		sql1.append("  SUM(IF(d.type = 2, 1, 0)) AS holonomy_count, ");
		sql1.append("  0 AS sign_amount ");
		sql1.append("FROM decoration.decoration d ");
		sql1.append("WHERE d.createTime IS NOT NULL ");
		sql1.append("GROUP BY stat_date, d.company ");
		sql1.append("ON DUPLICATE KEY UPDATE ");
		sql1.append("  measure_count = VALUES(measure_count), deposit_count = VALUES(deposit_count), ");
		sql1.append("  presign_count = VALUES(presign_count), sign_count = VALUES(sign_count), ");
		sql1.append("  resign_count = VALUES(resign_count), final_count = VALUES(final_count), ");
		sql1.append("  complete_count = VALUES(complete_count), waste_count = VALUES(waste_count), ");
		sql1.append("  termination_count = VALUES(termination_count), ");
		sql1.append("  midpack_count = VALUES(midpack_count), inclusive_count = VALUES(inclusive_count), ");
		sql1.append("  holonomy_count = VALUES(holonomy_count) ");

		session().createSQLQuery(sql1.toString()).executeUpdate();

		// ② 签约额（按 contractTime 归日，仅签约及以上单有合同时间）
		StringBuilder sql2 = new StringBuilder();
		sql2.append("INSERT INTO report.metric_decoration_daily ");
		sql2.append("(stat_date, company, measure_count, deposit_count, presign_count, sign_count, ");
		sql2.append(" resign_count, final_count, complete_count, waste_count, termination_count, ");
		sql2.append(" midpack_count, inclusive_count, holonomy_count, sign_amount) ");
		sql2.append("SELECT ");
		sql2.append("  DATE_FORMAT(d.contractTime, '%Y-%m-%d') AS stat_date, ");
		sql2.append("  d.company, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ");
		sql2.append("  IFNULL(SUM(d.orderTotalPrice), 0) AS sign_amount ");
		sql2.append("FROM decoration.decoration d ");
		sql2.append("WHERE d.contractTime IS NOT NULL AND d.status >= 3 ");
		sql2.append("GROUP BY stat_date, d.company ");
		sql2.append("ON DUPLICATE KEY UPDATE sign_amount = VALUES(sign_amount) ");

		session().createSQLQuery(sql2.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryFunnel(List<Filter> filters, int company) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT '量尺' AS name, SUM(measure_count) AS value FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '定金', SUM(deposit_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '预签', SUM(presign_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '签约', SUM(sign_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '决算', SUM(final_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '完工', SUM(complete_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING).addScalar("value", StandardBasicTypes.LONG);

		return toPoints(query.list());
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryStatusDist(List<Filter> filters, int company) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT '初始' AS name, SUM(measure_count - IFNULL(deposit_count,0)) AS value FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '定金', SUM(deposit_count - IFNULL(presign_count,0)) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '签约', SUM(sign_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '废单', SUM(waste_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '终止', SUM(termination_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '完工', SUM(complete_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING).addScalar("value", StandardBasicTypes.LONG);

		return toPoints(query.list());
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricTrendVO> querySignTrend(List<Filter> filters, int company) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT DATE_FORMAT(stat_date, '%Y-%m') AS date, SUM(sign_amount) AS amount ");
		sql.append("FROM report.metric_decoration_daily ");
		sql.append("WHERE company = :company AND sign_amount > 0");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY date ORDER BY date ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING).addScalar("amount", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricTrendVO> result = new ArrayList<MetricTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricTrendVO((String) row[0], ((Number) row[1]).longValue()));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryTypeDist(List<Filter> filters, int company) {

		String[] range = parseDateRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT '半包' AS name, SUM(midpack_count) AS value FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '整装', SUM(inclusive_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" UNION ALL SELECT '大包', SUM(holonomy_count) FROM report.metric_decoration_daily WHERE company = :company");
		sql.append(rangeClause(range));

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("name", StandardBasicTypes.STRING).addScalar("value", StandardBasicTypes.LONG);

		return toPoints(query.list());
	}

	// ---- 工具方法 ----

	/**
	 * 解析 filters 中的时间范围，返回 [startTime, endTime]（yyyy-MM-dd），无则返回 null。
	 */
	private String[] parseDateRange(List<Filter> filters) {

		String startTime = null;
		String endTime = null;

		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();

				if ("startTime".equals(field)) {
					startTime = data;
				} else if ("endTime".equals(field)) {
					endTime = data;
				}
			}
		}
		return new String[] { startTime, endTime };
	}

	/**
	 * 构造 stat_date 范围 SQL 片段。参数复用同名占位，由调用方 setString。
	 */
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

	private List<MetricPointVO> toPoints(List<Object[]> rows) {
		List<MetricPointVO> result = new ArrayList<MetricPointVO>();
		for (Object[] row : rows) {
			result.add(new MetricPointVO((String) row[0], ((Number) row[1]).longValue()));
		}
		return result;
	}

}
