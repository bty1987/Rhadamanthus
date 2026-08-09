package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.SalesMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 主材销售指标汇总 DAO。
 */
public interface SalesMetricDao extends Dao<SalesMonthlyMetricPO> {

	/** 全量重算销售月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 销售趋势：value1=销售单量，value2=销售总额。 */
	List<MetricDualTrendVO> querySalesTrend(List<Filter> filters, int company);

	/** 品类结构：按 category 返回销售额占比。 */
	List<MetricPointVO> queryCategoryDist(List<Filter> filters, int company);

}
