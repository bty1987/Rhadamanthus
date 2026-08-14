package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fanglin.report.dao.PanoramaMetricDao;
import com.fanglin.report.vo.OrderPanoramaVO;

/**
 * 订单全景穿透 DAO 实现。
 *
 * <p>单条 SQL 跨 5 库只读聚合（receipt/sales 用子查询，quotation/construction 用 LEFT JOIN）。
 * 不走 metric 汇总表——穿透是单订单实时查询，数据以业务表为准。
 */
@Repository("panoramaMetricDao")
public class PanoramaMetricDaoImpl implements PanoramaMetricDao {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	@SuppressWarnings("unchecked")
	public OrderPanoramaVO queryOrderPanorama(String orderId) {

		StringBuilder sql = new StringBuilder();
		sql.append("SELECT ");
		sql.append("  d.orderId, d.status, d.orderTotalPrice, ");
		sql.append("  IFNULL(DATE_FORMAT(d.createTime, '%Y-%m-%d'), '') AS createTime, ");
		sql.append("  IFNULL(DATE_FORMAT(d.contractTime, '%Y-%m-%d'), '') AS contractTime, ");
		sql.append("  IFNULL(q.totalPrice, 0) AS quotationAmount, ");
		sql.append("  IFNULL(d.orderTotalPrice, 0) - IFNULL(q.totalPrice, 0) AS diffAmount, ");
		sql.append("  IFNULL(c.process, -1) AS constructionProcess, ");
		sql.append("  IFNULL(DATE_FORMAT(c.startTime, '%Y-%m-%d'), '') AS startTime, ");
		sql.append("  IFNULL(DATE_FORMAT(c.finishTime, '%Y-%m-%d'), '') AS finishTime, ");
		sql.append("  IFNULL(c.period, 0) AS period, ");
		sql.append("  IFNULL((SELECT SUM(CASE WHEN r.type = 0 THEN r.money ELSE 0 END) FROM payment.receipt r WHERE r.orderId = d.orderId), 0) AS collectAmount, ");
		sql.append("  IFNULL((SELECT SUM(CASE WHEN r.type = 1 THEN r.money ELSE 0 END) FROM payment.receipt r WHERE r.orderId = d.orderId), 0) AS refundAmount, ");
		sql.append("  IFNULL((SELECT SUM(CASE WHEN r.type = 0 THEN r.money ELSE -r.money END) FROM payment.receipt r WHERE r.orderId = d.orderId), 0) AS paidupAmount, ");
		sql.append("  IFNULL((SELECT COUNT(*) FROM sales.sales s WHERE s.orderId = d.orderId AND s.status NOT IN (4)), 0) AS salesCount, ");
		sql.append("  IFNULL((SELECT SUM(s.total) FROM sales.sales s WHERE s.orderId = d.orderId AND s.status NOT IN (4)), 0) AS salesAmount ");
		sql.append("FROM decoration.decoration d ");
		sql.append("LEFT JOIN quotation.quotation q ON q.orderId = d.orderId AND q.defaults = 1 ");
		sql.append("LEFT JOIN construction.construction c ON c.orderId = d.orderId ");
		sql.append("WHERE d.orderId = :orderId ");

		SQLQuery query = sessionFactory.getCurrentSession().createSQLQuery(sql.toString());
		query.setString("orderId", orderId);
		query.addScalar("orderId", StandardBasicTypes.STRING);
		query.addScalar("status", StandardBasicTypes.INTEGER);
		query.addScalar("orderTotalPrice", StandardBasicTypes.LONG);
		query.addScalar("createTime", StandardBasicTypes.STRING);
		query.addScalar("contractTime", StandardBasicTypes.STRING);
		query.addScalar("quotationAmount", StandardBasicTypes.LONG);
		query.addScalar("diffAmount", StandardBasicTypes.LONG);
		query.addScalar("constructionProcess", StandardBasicTypes.INTEGER);
		query.addScalar("startTime", StandardBasicTypes.STRING);
		query.addScalar("finishTime", StandardBasicTypes.STRING);
		query.addScalar("period", StandardBasicTypes.INTEGER);
		query.addScalar("collectAmount", StandardBasicTypes.LONG);
		query.addScalar("refundAmount", StandardBasicTypes.LONG);
		query.addScalar("paidupAmount", StandardBasicTypes.LONG);
		query.addScalar("salesCount", StandardBasicTypes.LONG);
		query.addScalar("salesAmount", StandardBasicTypes.LONG);

		List<Object[]> rows = query.list();
		if (rows.isEmpty()) {
			return null;
		}

		Object[] row = rows.get(0);
		OrderPanoramaVO vo = new OrderPanoramaVO();
		vo.setOrderId((String) row[0]);
		vo.setStatus(toInt(row[1]));
		vo.setSignAmount(toLong(row[2]));
		vo.setCreateTime((String) row[3]);
		vo.setContractTime((String) row[4]);
		vo.setQuotationAmount(toLong(row[5]));
		vo.setDiffAmount(toLong(row[6]));
		vo.setConstructionProcess(toInt(row[7]));
		vo.setStartTime((String) row[8]);
		vo.setFinishTime((String) row[9]);
		vo.setPeriod(toInt(row[10]));
		vo.setCollectAmount(toLong(row[11]));
		vo.setRefundAmount(toLong(row[12]));
		vo.setPaidupAmount(toLong(row[13]));
		vo.setSalesCount(toLong(row[14]));
		vo.setSalesAmount(toLong(row[15]));
		return vo;
	}

	private long toLong(Object obj) {
		return obj == null ? 0L : ((Number) obj).longValue();
	}

	private int toInt(Object obj) {
		return obj == null ? 0 : ((Number) obj).intValue();
	}

}
