package com.fanglin.report.analytics.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.analytics.vo.MetricPointVO;
import com.fanglin.report.analytics.vo.MetricTrendVO;

/**
 * 装修销售转化分析服务。
 *
 * <p>查询 report.metric_decoration_daily 汇总表，供前端 4 维度报表使用。
 */
public interface DecorationAnalyticsService {

	/** 漏斗：量尺→定金→预签→签约→决算→完工各阶段累计订单数。 */
	List<MetricPointVO> queryFunnel(List<Filter> filters, int company);

	/** 状态分布：各状态订单数占比。 */
	List<MetricPointVO> queryStatusDist(List<Filter> filters, int company);

	/** 签约额趋势：按月签约额。 */
	List<MetricTrendVO> querySignTrend(List<Filter> filters, int company);

	/** 装修类型分布：半包/整装/大包订单数。 */
	List<MetricPointVO> queryTypeDist(List<Filter> filters, int company);

	/** 手动触发重算汇总表。 */
	void refreshMetric();

}
