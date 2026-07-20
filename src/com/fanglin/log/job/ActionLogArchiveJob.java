/**
 * @File Name		: ActionLogArchiveJob.java
 * @Package 		: com.fanglin.log.job
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 操作日志归档定时任务（每月 1 号凌晨 2 点）
 *
 *  执行流程：
 *    1. 计算 cutoffTime = now - retentionDays（默认 90 天）
 *    2. 委托 ActionLogArchiveService.archiveBefore 执行按月归档
 *    3. 整个任务不抛异常（内部已 try-catch），失败仅记日志，下次重试
 *
 *  启用前置条件：
 *    ApplicationContext.xml 必须加 <task:annotation-driven/>（本项目首次引入调度）
 *    依赖 spring-context-support-4.3.17（WebContent/WEB-INF/lib 已存在）
 */

package com.fanglin.log.job;

import java.sql.Timestamp;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fanglin.log.service.ActionLogArchiveService;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Component
public class ActionLogArchiveJob {

	private static final Logger logger = LoggerFactory.getLogger(ActionLogArchiveJob.class);

	@Autowired
	private ActionLogArchiveService actionLogArchiveService;

	/**
	 * 每月 1 号凌晨 2 点执行归档。
	 *
	 * <p>cron 表达式：秒 分 时 日 月 周
	 * "0 0 2 1 * ?" = 每月 1 号 02:00:00 执行
	 *
	 * <p>选择凌晨 2 点的原因：
	 * - 避开 0:00 的其他系统定时任务高峰
	 * - 业务低峰期，减少锁竞争
	 * - 归档失败有 28 天窗口补救（下个月 1 号会重试）
	 */
	@Scheduled(cron = "0 0 2 1 * ?")
	public void archiveMonthly(){
		logger.info("[actionLog-archive] job started at {}", new Date());

		try {
			int retentionDays = SystemConfig.getInt("actionLog.retentionDays", 90);
			long cutoffMillis = System.currentTimeMillis() - retentionDays * 24L * 60 * 60 * 1000;
			Timestamp cutoffTime = DateUtil.getDateToTimestamp(new Date(cutoffMillis));

			int total = actionLogArchiveService.archiveBefore(cutoffTime);
			logger.info("[actionLog-archive] job finished, cutoff={}, archivedTotal={}", cutoffTime, total);
		} catch (Throwable t) {
			// 兜底：定时任务本身不抛异常，避免 Spring 调度器因异常停止后续调度
			logger.error("[actionLog-archive] job failed", t);
		}
	}

}
