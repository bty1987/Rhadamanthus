package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.SalaryMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 人力薪酬指标汇总 DAO。
 */
public interface SalaryMetricDao extends Dao<SalaryMonthlyMetricPO> {

	/** 全量重算薪酬月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 工费趋势：value1=工费单量，value2=实发总额。 */
	List<MetricDualTrendVO> querySalaryTrend(List<Filter> filters, int company);

	/** 工种结构：按 twotype 返回实发额占比。 */
	List<MetricPointVO> queryWorkerTypeDist(List<Filter> filters, int company);

}
