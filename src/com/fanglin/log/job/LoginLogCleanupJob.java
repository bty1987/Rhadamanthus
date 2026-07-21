/**
 * @File Name		: LoginLogCleanupJob.java
 * @Package 		: com.fanglin.log.job
 * @Version			: 1.0
 * @Date			: 2026-07-21
 * @Describing		: 登录日志定期清理任务（每天凌晨 3 点）
 *
 *  背景（P0-3）：
 *    原 LoginLogServiceImpl.addLoginLog 内部调 delteBeforLoginTime 清理 30 天前数据，
 *    但 Phase 8 改造后登录写入走 recordLogin（不含清理），addLoginLog 沦为死代码，
 *    导致 delteBeforLoginTime 实际无人调用，loginLog 表无限膨胀。
 *
 *  方案：
 *    用独立的 @Scheduled 任务定期清理，避免每次登录都触发全表 delete。
 *    清理阈值 recordLoginLogDay（默认 30 天）。
 *
 *  执行频率：
 *    cron = "0 0 3 * * ?" 每天 03:00 执行一次，业务低峰期
 */

package com.fanglin.log.job;

import java.sql.Timestamp;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fanglin.log.dao.LoginLogDao;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Component
public class LoginLogCleanupJob {

	private static final Logger logger = LoggerFactory.getLogger(LoginLogCleanupJob.class);

	@Autowired
	private LoginLogDao loginLogDao;

	/**
	 * 每天凌晨 3 点清理超期登录日志。
	 *
	 * <p>cron "0 0 3 * * ?" = 每天 03:00:00。
	 * 选择凌晨 3 点：避开 0:00 的其他系统任务高峰，业务低峰期减少锁竞争。
	 *
	 * <p>清理阈值 recordLoginLogDay（默认 30 天），可由 sysconfig.properties 配置。
	 * 清理失败不抛异常，下次执行会重试。
	 */
	@Scheduled(cron = "0 0 3 * * ?")
	public void cleanupExpiredLoginLog(){
		logger.info("[loginLog-cleanup] job started at {}", new Date());

		try {
			int retentionDays = SystemConfig.getInt("recordLoginLogDay", 30);
			long cutoffMillis = System.currentTimeMillis() - retentionDays * 24L * 60 * 60 * 1000;
			Timestamp cutoffTime = DateUtil.getDateToTimestamp(new Date(cutoffMillis));

			// 注意：delteBeforLoginTime 是项目历史遗留的拼写（应为 deleteBeforeLoginTime）
			// 这里沿用旧方法名避免破坏既有调用链，P3 列入后续规范化
			loginLogDao.delteBeforLoginTime(cutoffTime);

			logger.info("[loginLog-cleanup] job finished, cleaned logs before {} (retentionDays={})", cutoffTime, retentionDays);
		} catch (Throwable t) {
			// 兜底：定时任务本身不抛异常，避免 Spring 调度器因异常停止后续调度
			logger.error("[loginLog-cleanup] job failed", t);
		}
	}

}
