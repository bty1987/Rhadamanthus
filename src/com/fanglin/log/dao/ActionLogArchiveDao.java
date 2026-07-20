/**
 * @File Name		: ActionLogArchiveDao.java
 * @Package 		: com.fanglin.log.dao
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 操作日志归档 DAO（原生 SQL，跨表 INSERT/DELETE）
 *
 *  设计说明：
 *    项目无 UNION/动态表名先例，本 DAO 自创一套，遵循"结构可拼、值必绑定"规范。
 *    表名（actionlog_yyyymm）无法用 :param 绑定，只能字符串拼接，但调用方
 *    ActionLogArchiveService 会做正则白名单校验（^\d{6}$），杜绝注入。
 */

package com.fanglin.log.dao;

import java.sql.Timestamp;

public interface ActionLogArchiveDao {

	/**
	 * 检查指定月份的归档表是否存在。
	 * @param monthYm 月份字符串，格式 yyyyMM（如 "202605"），调用方负责白名单校验
	 * @return true=存在
	 */
	boolean archiveTableExists(String monthYm);

	/**
	 * 统计热表中指定时间段内的记录数（归档前预估数据量用）。
	 */
	long countByTimeRange(Timestamp start, Timestamp end);

	/**
	 * 把热表中指定时间段的数据 INSERT 到归档表。
	 * @param monthYm       目标归档表月份 yyyyMM（调用方负责白名单校验）
	 * @param rangeStart    时间段开始（含）
	 * @param rangeEnd      时间段结束（不含）
	 * @return 实际插入行数
	 */
	int archiveToMonthTable(String monthYm, Timestamp rangeStart, Timestamp rangeEnd);

	/**
	 * 删除热表中指定时间段且已归档的数据。
	 * 必须在 archiveToMonthTable 成功后调用。
	 * @param rangeStart 时间段开始（含）
	 * @param rangeEnd   时间段结束（不含）
	 * @return 实际删除行数
	 */
	int deleteArchivedRange(Timestamp rangeStart, Timestamp rangeEnd);

}
