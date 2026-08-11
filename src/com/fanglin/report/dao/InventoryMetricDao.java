package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.InventoryMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 仓储物流指标汇总 DAO。
 */
public interface InventoryMetricDao extends Dao<InventoryMonthlyMetricPO> {

	/** 全量重算仓储月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 出入库趋势：value1=入库单据量，value2=出库单据量。 */
	List<MetricDualTrendVO> queryInOutTrend(List<Filter> filters, int company);

	/** 出入库类型结构：按 type 返回单据量占比。 */
	List<MetricPointVO> queryTypeDist(List<Filter> filters, int company);

}
