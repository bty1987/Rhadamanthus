package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.PaymentDailyMetricPO;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 财务收款指标汇总 DAO。
 *
 * <p>职责一 {@link #rebuild()}：跨库只读聚合 payment.receipt，幂等写入 report.metric_payment_daily。
 * <p>职责二 查询：从汇总表按 company + 时间范围聚合，供报表查询。
 */
public interface PaymentMetricDao extends Dao<PaymentDailyMetricPO> {

	/** 全量重算收款日级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 收款趋势：按月返回收款额（type=0）。 */
	List<MetricTrendVO> queryCollectTrend(List<Filter> filters, int company);

	/** 退款趋势：按月返回退款额（type=1）。 */
	List<MetricTrendVO> queryRefundTrend(List<Filter> filters, int company);

	/** 净收款趋势：按月返回（收款 - 退款）。 */
	List<MetricTrendVO> queryNetTrend(List<Filter> filters, int company);

	/** 款项结构：按 paymentType 返回收款额占比（type=0）。 */
	List<MetricPointVO> queryPaymentTypeDist(List<Filter> filters, int company);

}
