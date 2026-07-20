/**
 * @File Name		: ActionLogArchiveDaoImpl.java
 * @Package 		: com.fanglin.log.dao.impl
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 操作日志归档 DAO 实现（原生 SQL）
 */

package com.fanglin.log.dao.impl;

import java.sql.Timestamp;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.GenericDaoImpl;
import com.fanglin.log.dao.ActionLogArchiveDao;

@Repository("actionLogArchiveDao")
public class ActionLogArchiveDaoImpl extends GenericDaoImpl implements ActionLogArchiveDao {

	@Override
	public boolean archiveTableExists(String monthYm){
		// monthYm 已由 Service 层做正则白名单校验，此处仅查 information_schema
		// 注意：log schema 在 MySQL 中实际名就是 "log"（小写）
		String sql = "SELECT COUNT(1) FROM information_schema.tables "
				+ "WHERE table_schema = :schema AND table_name = :name";
		Number count = (Number) session().createSQLQuery(sql)
				.setString("schema", "log")
				.setString("name", "actionlog_" + monthYm)
				.uniqueResult();
		return count != null && count.longValue() > 0;
	}

	@Override
	public long countByTimeRange(Timestamp start, Timestamp end){
		String sql = "SELECT COUNT(1) FROM log.actionlog WHERE createTime >= :start AND createTime < :end";
		Number count = (Number) session().createSQLQuery(sql)
				.setTimestamp("start", start)
				.setTimestamp("end", end)
				.uniqueResult();
		return count == null ? 0 : count.longValue();
	}

	@Override
	public int archiveToMonthTable(String monthYm, Timestamp rangeStart, Timestamp rangeEnd){
		// monthYm 已由 Service 做白名单校验；表名只能拼（JDBC 不支持表名作参数）
		// INSERT INTO ... SELECT ...：归档表结构与热表完全一致（DBA 用 LIKE 建）
		String sql = "INSERT INTO log.actionlog_" + monthYm
				+ " SELECT * FROM log.actionlog WHERE createTime >= :start AND createTime < :end";
		return session().createSQLQuery(sql)
				.setTimestamp("start", rangeStart)
				.setTimestamp("end", rangeEnd)
				.executeUpdate();
	}

	@Override
	public int deleteArchivedRange(Timestamp rangeStart, Timestamp rangeEnd){
		String sql = "DELETE FROM log.actionlog WHERE createTime >= :start AND createTime < :end";
		return session().createSQLQuery(sql)
				.setTimestamp("start", rangeStart)
				.setTimestamp("end", rangeEnd)
				.executeUpdate();
	}

}
