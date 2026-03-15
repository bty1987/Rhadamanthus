package com.fanglin.quotation.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;

/**
 * 装修单预算分配请求表 DAO 实现
 */
@Repository("quotationAssignRequestDao")
public class QuotationAssignRequestDaoImpl extends DaoImpl<QuotationAssignRequestPO> implements QuotationAssignRequestDao {

	public QuotationAssignRequestDaoImpl() {
		super(QuotationAssignRequestPO.class);
	}

	@Override
	public QuotationAssignRequestPO findByOrderId(String orderId) {
		return (QuotationAssignRequestPO) createCriteria(QuotationAssignRequestPO.class)
				.add(Restrictions.eq("orderId", orderId))
				.add(Restrictions.in("status", new Byte[] {
					QuotationAssignRequestPO.STATUS_PENDING_INT,
					QuotationAssignRequestPO.STATUS_ASSIGNED_INT
				}))
				.uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO findTopPriorityRequest(Integer company, Integer department) {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_PENDING_INT));

		if (department != null) {
			criteria.add(Restrictions.eq("department", department));
		}

		criteria.addOrder(Order.asc("priority"));
		criteria.addOrder(Order.asc("requestTime"));
		criteria.setMaxResults(1);

		return (QuotationAssignRequestPO) criteria.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public QuotationAssignRequestPO findTopPriorityRequestByTypes(Integer company, Integer department, List<Byte> supportedTypes) {
		// 使用 SQL 查询，因为需要 JOIN quotationuserruletype 表
		String sql = "SELECT bar.* FROM quotation.quotationassignrequest bar " +
				     "INNER JOIN quotation.quotationuserruletype burtype ON bar.decorationType = burtype.type " +
				     "WHERE bar.status = :status " +
				     "AND bar.company = :company " +
				     "AND burtype.type IN (:types) ";

		if (department != null) {
			sql += "AND (bar.department IS NULL OR bar.department = :department) ";
		}

		sql += "ORDER BY bar.priority ASC, bar.requestTime ASC " +
		       "LIMIT 1 FOR UPDATE";

		org.hibernate.SQLQuery query = getSession().createSQLQuery(sql);
		query.addEntity(QuotationAssignRequestPO.class);
		query.setParameter("status", QuotationAssignRequestPO.STATUS_PENDING_INT);
		query.setParameter("company", company);
		query.setParameterList("types", supportedTypes);

		if (department != null) {
			query.setParameter("department", department);
		}

		return (QuotationAssignRequestPO) query.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRequestPO> findPendingQueue(Integer company, Integer department) {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_PENDING_INT));

		if (department != null) {
			criteria.add(Restrictions.eq("department", department));
		}

		criteria.addOrder(Order.asc("priority"));
		criteria.addOrder(Order.asc("requestTime"));

		return criteria.list();
	}

	@Override
	public int countPendingQueue(Integer company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRequestPO WHERE company = :company AND status = :status";
		return ((Number) getSession().createQuery(hql)
				.setParameter("company", company)
				.setParameter("status", QuotationAssignRequestPO.STATUS_PENDING_INT)
				.uniqueResult()).intValue();
	}

	@Override
	public int getQueuePosition(Integer company, Timestamp requestTime) {
		String hql = "SELECT COUNT(*) + 1 FROM QuotationAssignRequestPO " +
				     "WHERE company = :company AND status = :status " +
				     "AND (priority < :priority OR (priority = :priority AND requestTime < :requestTime))";

		QuotationAssignRequestPO temp = findByOrderId(null);
		Byte priority = temp != null ? temp.getPriority() : QuotationAssignRequestPO.PRIORITY_NORMAL_INT;

		return ((Number) getSession().createQuery(hql)
				.setParameter("company", company)
				.setParameter("status", QuotationAssignRequestPO.STATUS_PENDING_INT)
				.setParameter("priority", priority)
				.setParameter("requestTime", requestTime)
				.uniqueResult()).intValue();
	}
}
