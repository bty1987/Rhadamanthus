package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.HomeRankDao;

/**
 * 首页排名 DAO 实现：native SQL 跨库只读聚合（decoration / construction / communion 同实例）。
 * 
 * <p>
 * 签单业绩按 contractTime 范围过滤可命中 decoration.indexelv 索引，避免全表扫描。
 */
@Repository("homeRankDao")
public class HomeRankDaoImpl extends DaoImpl<Object> implements HomeRankDao {

	public HomeRankDaoImpl() {
		super();
	}

	@Override
	public List<Object[]> queryDesignerSignRankForTop(String startTime, String endTime, int top, int company) {
		return querySignRankForTop("d.dsuid", startTime, endTime, top, company);
	}

	@Override
	public List<Object[]> querySalesmanSignRankForTop(String startTime, String endTime, int top, int company) {
		return querySignRankForTop("d.smuid", startTime, endTime, top, company);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> querySupervisorSiteRankForTop(String startTime, int top, int company) {

		StringBuilder sql = new StringBuilder();
		sql.append("SELECT u.userId AS userId, ");
		sql.append("IFNULL(NULLIF(u.currentName, ''), u.userName) AS name, ");
		sql.append("IFNULL(u.userPhoto, '') AS photo, ");
		sql.append("COUNT(*) AS value ");
		sql.append("FROM construction.construction c ");
		sql.append("JOIN decoration.decoration d ON d.orderId = c.orderId ");
		sql.append("JOIN communion.user u ON u.uid = c.suid ");
		sql.append("WHERE d.company = :company ");
		sql.append("AND c.createTime >= :startTime ");
		sql.append("AND d.projectStatus < 2 ");
		sql.append("AND NOT EXISTS (SELECT 1 FROM construction.acceptance a WHERE a.orderId = c.orderId) ");
		sql.append("GROUP BY u.uid ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.setString("startTime", startTime);
		query.setMaxResults(top);
		query.addScalar("userId", StandardBasicTypes.STRING);
		query.addScalar("name", StandardBasicTypes.STRING);
		query.addScalar("photo", StandardBasicTypes.STRING);
		query.addScalar("value", StandardBasicTypes.LONG);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	private List<Object[]> querySignRankForTop(String column, String startTime, String endTime, int top, int company) {

		StringBuilder sql = new StringBuilder();
		sql.append("SELECT u.userId AS userId, ");
		sql.append("IFNULL(NULLIF(u.currentName, ''), u.userName) AS name, ");
		sql.append("IFNULL(u.userPhoto, '') AS photo, ");
		sql.append("SUM(d.orderTotalPrice) AS value ");
		sql.append("FROM decoration.decoration d ");
		sql.append("JOIN communion.user u ON u.uid = " + column + " ");
		sql.append("WHERE d.company = :company ");
		sql.append("AND d.status >= 3 ");
		sql.append("AND d.contractTime >= :startTime ");
		sql.append("AND d.contractTime < :endTime ");
		sql.append("GROUP BY u.uid ");

		SQLQuery query = session().createSQLQuery(sql.toString());
		query.setInteger("company", company);
		query.setString("startTime", startTime);
		query.setString("endTime", endTime);
		query.setMaxResults(top);
		query.addScalar("userId", StandardBasicTypes.STRING);
		query.addScalar("name", StandardBasicTypes.STRING);
		query.addScalar("photo", StandardBasicTypes.STRING);
		query.addScalar("value", StandardBasicTypes.LONG);

		return query.list();
	}

}
