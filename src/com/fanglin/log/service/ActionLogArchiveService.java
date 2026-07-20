/**
 * @File Name		: ActionLogArchiveService.java
 * @Package 		: com.fanglin.log.service
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 操作日志归档 Service
 */

package com.fanglin.log.service;

import java.sql.Timestamp;

import com.fanglin.log.service.impl.ActionLogArchiveServiceImpl.MonthRange;

public interface ActionLogArchiveService {

	/**
	 * 归档 cutoffTime 之前的数据到按月分表。
	 *
	 * <p>调用方（定时任务）传入 cutoffTime（通常 = now - retentionDays），
	 * 本方法把热表中 createTime < cutoffTime 的数据按月分组归档。
	 *
	 * <p>安全保证：对每个月，先 INSERT 到归档表成功后才 DELETE 热表数据。
	 * 归档表不存在时跳过该月（不删热表），记录告警日志，等 DBA 建表后下个月重试。
	 *
	 * @param cutoffTime 归档截止时间，createTime 早于此时间的数据将被归档
	 * @return 归档的总行数（-1 表示开关关闭）
	 */
	int archiveBefore(Timestamp cutoffTime);

	/**
	 * 单月归档（独立事务）。放接口里是为了让 Spring 代理能拦截，
	 * archiveBefore 通过自身代理调用此方法发起 REQUIRES_NEW 事务。
	 */
	int archiveOneMonth(MonthRange mr);

}
