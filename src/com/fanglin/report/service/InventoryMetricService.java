package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 仓储物流指标服务。
 */
public interface InventoryMetricService {

	/** 出入库趋势：value1=入库单据量，value2=出库单据量。 */
	List<MetricDualTrendVO> queryInOutTrend(List<Filter> filters, int company);

	/** 出入库类型结构：按 type 单据量占比。 */
	List<MetricPointVO> queryTypeDist(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
