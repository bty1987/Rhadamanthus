package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 财务收款指标服务。
 *
 * <p>查询 report.metric_payment_daily 汇总表，供前端收款报表使用。
 */
public interface PaymentMetricService {

	/** 收款趋势：按月收款额。 */
	List<MetricTrendVO> queryCollectTrend(List<Filter> filters, int company);

	/** 退款趋势：按月退款额。 */
	List<MetricTrendVO> queryRefundTrend(List<Filter> filters, int company);

	/** 净收款趋势：按月（收款 - 退款）。 */
	List<MetricTrendVO> queryNetTrend(List<Filter> filters, int company);

	/** 款项结构：按 paymentType 收款额占比。 */
	List<MetricPointVO> queryPaymentTypeDist(List<Filter> filters, int company);

	/** 手动触发重算汇总表。 */
	void refreshMetric();

}
