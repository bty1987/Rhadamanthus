package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.InventoryMetricDao;
import com.fanglin.report.po.InventoryMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 仓储物流指标汇总 DAO 实现。
 *
 * <p>{@link #rebuild()} 跨库只读聚合 inventory.manifest，按 manifestTime 归月。
 * 出入库方向映射（基于 ManifestPO 常量）：
 * <ul>
 *   <li>入库(direction=0)：1进货CG / 4出返XB / 6采购PU / 8辅退AR / 11盘盈CP / 5调拨DB / 9套合PM</li>
 *   <li>出库(direction=1)：2进退CR / 3出货XG / 7辅料AS / 12盘亏CL / 5调拨DB / 9套合PM</li>
 * </ul>
 * 调拨(DB)与套合(PM)既入库又出库，归"双向"用 direction=2 标记。
 */
@Repository("inventoryMetricDao")
public class InventoryMetricDaoImpl extends DaoImpl<InventoryMonthlyMetricPO> implements InventoryMetricDao {

	// 出入库方向：入库类 type
	private static final String IN_TYPES = "1,4,6,8,11";
	// 出库类 type
	private static final String OUT_TYPES = "2,3,7,12";

	public InventoryMetricDaoImpl() {
		super(InventoryMonthlyMetricPO.class);
	}

	@Override
	public void rebuild() {

		// 入库类（direction=0）
		StringBuilder sqlIn = new StringBuilder();
		sqlIn.append("INSERT INTO report.metric_inventory_monthly ");
		sqlIn.append("(stat_month, company, type, direction, manifest_count) ");
		sqlIn.append("SELECT DATE_FORMAT(m.manifestTime, '%Y-%m') AS stat_month, ");
		sqlIn.append("  m.company, m.type, 0 AS direction, COUNT(*) AS manifest_count ");
		sqlIn.append("FROM inventory.manifest m ");
		sqlIn.append("WHERE m.manifestTime IS NOT NULL AND m.company > 0 AND m.status = 1 ");
		sqlIn.append("  AND m.type IN (1,4,6,8,11) ");
		sqlIn.append("GROUP BY stat_month, m.company, m.type ");
		sqlIn.append("ON DUPLICATE KEY UPDATE manifest_count = VALUES(manifest_count) ");
		session().createSQLQuery(sqlIn.toString()).executeUpdate();

		// 出库类（direction=1）
		StringBuilder sqlOut = new StringBuilder();
		sqlOut.append("INSERT INTO report.metric_inventory_monthly ");
		sqlOut.append("(stat_month, company, type, direction, manifest_count) ");
		sqlOut.append("SELECT DATE_FORMAT(m.manifestTime, '%Y-%m') AS stat_month, ");
		sqlOut.append("  m.company, m.type, 1 AS direction, COUNT(*) AS manifest_count ");
		sqlOut.append("FROM inventory.manifest m ");
		sqlOut.append("WHERE m.manifestTime IS NOT NULL AND m.company > 0 AND m.status = 1 ");
		sqlOut.append("  AND m.type IN (2,3,7,12) ");
		sqlOut.append("GROUP BY stat_month, m.company, m.type ");
		sqlOut.append("ON DUPLICATE KEY UPDATE manifest_count = VALUES(manifest_count) ");
		session().createSQLQuery(sqlOut.toString()).executeUpdate();

		// 双向类-调拨DB(5)/套合PM(9)：按 direction=2 标记（入库侧），便于类型结构展示
		StringBuilder sqlDual = new StringBuilder();
		sqlDual.append("INSERT INTO report.metric_inventory_monthly ");
		sqlDual.append("(stat_month, company, type, direction, manifest_count) ");
		sqlDual.append("SELECT DATE_FORMAT(m.manifestTime, '%Y-%m') AS stat_month, ");
		sqlDual.append("  m.company, m.type, 2 AS direction, COUNT(*) AS manifest_count ");
		sqlDual.append("FROM inventory.manifest m ");
		sqlDual.append("WHERE m.manifestTime IS NOT NULL AND m.company > 0 AND m.status = 1 ");
		sqlDual.append("  AND m.type IN (5,9) ");
		sqlDual.append("GROUP BY stat_month, m.company, m.type ");
		sqlDual.append("ON DUPLICATE KEY UPDATE manifest_count = VALUES(manifest_count) ");
		session().createSQLQuery(sqlDual.toString()).executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricDualTrendVO> queryInOutTrend(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT stat_month AS date, ");
		sql.append("  SUM(IF(direction = 0, manifest_count, 0)) AS inVal, ");
		sql.append("  SUM(IF(direction = 1, manifest_count, 0)) AS outVal ");
		sql.append("FROM report.metric_inventory_monthly ");
		sql.append("WHERE company = :company");
		sql.append(rangeClause(range));
		sql.append(" GROUP BY stat_month ORDER BY stat_month ASC ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.addScalar("date", StandardBasicTypes.STRING);
		query.addScalar("inVal", StandardBasicTypes.LONG);
		query.addScalar("outVal", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		List<MetricDualTrendVO> result = new ArrayList<MetricDualTrendVO>();
		for (Object[] row : rows) {
			result.add(new MetricDualTrendVO((String) row[0], ((Number) row[1]).longValue(), ((Number) row[2]).longValue()));
		}
		return result;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MetricPointVO> queryTypeDist(List<Filter> filters, int company) {

		String[] range = parseMonthRange(filters);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT CASE type ");
		sql.append("  WHEN 1 THEN '进货' WHEN 2 THEN '进退' WHEN 3 THEN '出货' WHEN 4 THEN '出返' ");
		sql.append("  WHEN 5 THEN '调拨' WHEN 6 THEN '采购' WHEN 7 THEN '辅料' WHEN 8 THEN '辅退' ");
		sql.append("  WHEN 9 THEN '套合' WHEN 11 THEN '盘盈' WHEN 12 THEN '盘亏' ELSE '其他' END AS name, ");
		sql.append("  SUM(manifest_count) AS value ");
		sql.append("FROM report.metric_inventory_monthly ");
		sql.append("WHERE company = :company");
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

	@SuppressWarnings("unchecked")
	private List<MetricPointVO> toPoints(List<Object[]> rows) {
		List<MetricPointVO> result = new ArrayList<MetricPointVO>();
		for (Object[] row : rows) {
			result.add(new MetricPointVO((String) row[0], ((Number) row[1]).longValue()));
		}
		return result;
	}

}
