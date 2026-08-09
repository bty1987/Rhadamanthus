/**
 * 报表指标汇总定时任务。
 *
 * <p>每日凌晨 1:30 全量重算 report.metric_* 汇总表（错开 log 归档的 2:00）。
 * 跨库只读聚合业务表，幂等写入汇总表，对业务模块零侵入。
 *
 * <p>启用前置条件：ApplicationContext.xml 已配置 &lt;task:annotation-driven/&gt;（已存在）。
 * 参考 log.job.ActionLogArchiveJob 写法：任务不抛异常，失败仅记日志，次日自动重试。
 */
package com.fanglin.report.job;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fanglin.report.service.impl.DecorationMetricCalculator;
import com.fanglin.report.service.impl.PaymentMetricCalculator;

@Component
public class ReportMetricJob {

	private static final Logger logger = LoggerFactory.getLogger(ReportMetricJob.class);

	@Autowired
	private DecorationMetricCalculator decorationMetricCalculator;

	@Autowired
	private PaymentMetricCalculator paymentMetricCalculator;

	/**
	 * 每日凌晨 1:30 重算装修指标汇总。
	 *
	 * <p>cron "0 30 1 * * ?" = 每日 01:30:00。后续主题域（payment/sales 等）的 Calculator
	 * 在此方法内依次调用即可。
	 */
	@Scheduled(cron = "0 30 1 * * ?")
	public void refreshDaily() {

		logger.info("[metric-refresh] job started at {}", new Date());

		try {
			decorationMetricCalculator.rebuild();
			paymentMetricCalculator.rebuild();
			// TODO: salesMetricCalculator.rebuild(); constructionMetricCalculator.rebuild(); ...

			logger.info("[metric-refresh] job finished at {}", new Date());
		} catch (Throwable t) {
			// 兜底：任务本身不抛异常，避免 Spring 调度器因异常停止后续调度
			logger.error("[metric-refresh] job failed", t);
		}
	}

}
