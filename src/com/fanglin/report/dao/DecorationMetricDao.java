package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.DecorationDailyMetricPO;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 装修指标汇总 DAO。
 *
 * <p>职责一 {@link #rebuild()}：跨库只读聚合 decoration.decoration，幂等写入 report.metric_decoration_daily。
 * <p>职责二 查询：从汇总表按 company + 时间范围聚合，供报表查询。
 */
public interface DecorationMetricDao extends Dao<DecorationDailyMetricPO> {

	/** 全量重算装修日级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 漏斗：返回各阶段累计订单数（量尺/定金/预签/签约/决算/完工）。 */
	List<MetricPointVO> queryFunnel(List<Filter> filters, int company);

	/** 状态分布：返回各状态订单数（初始/定金/签约/废单/终止/完工等）。 */
	List<MetricPointVO> queryStatusDist(List<Filter> filters, int company);

	/** 签约额趋势：按月返回签约额。 */
	List<MetricTrendVO> querySignTrend(List<Filter> filters, int company);

	/** 装修类型分布：返回半包/整装/大包订单数。 */
	List<MetricPointVO> queryTypeDist(List<Filter> filters, int company);

}
