package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.ConstructionMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 施工履约指标汇总 DAO。
 */
public interface ConstructionMetricDao extends Dao<ConstructionMonthlyMetricPO> {

	/** 全量重算施工月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 开工/完工趋势：value1=开工量，value2=完工量。 */
	List<MetricDualTrendVO> queryStartFinishTrend(List<Filter> filters, int company);

	/** 工期对比：value1=平均实际工期，value2=平均计划工期。 */
	List<MetricDualTrendVO> queryPeriodTrend(List<Filter> filters, int company);

	/** 履约健康度：按月返回超期数（name=月份，value=超期数）。 */
	List<MetricPointVO> queryOverdueDist(List<Filter> filters, int company);

}
