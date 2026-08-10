package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.CustomerMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 客户获客指标汇总 DAO。
 */
public interface CustomerMetricDao extends Dao<CustomerMonthlyMetricPO> {

	/** 全量重算客户获客月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 获客漏斗趋势：value1=报备量，value2=确认量。 */
	List<MetricDualTrendVO> queryFunnelTrend(List<Filter> filters, int company);

	/** 来源渠道结构：按 source 返回报备量占比。 */
	List<MetricPointVO> querySourceDist(List<Filter> filters, int company);

	/** 转单趋势：按月返回转单量。 */
	List<MetricPointVO> queryConvertTrend(List<Filter> filters, int company);

}
