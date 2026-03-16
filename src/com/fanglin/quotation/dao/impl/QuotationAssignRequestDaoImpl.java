package com.fanglin.quotation.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配请求表 DAO 实现 职责: 控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
 */
@Repository("quotationAssignRequestDao")
public class QuotationAssignRequestDaoImpl extends DaoImpl<QuotationAssignRequestPO> implements QuotationAssignRequestDao {

	public QuotationAssignRequestDaoImpl() {
		super(QuotationAssignRequestPO.class);
	}

	@Override
	public List<QuotationAssignRequestPO> page(Paging paging, List<Filter> filters) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public QuotationAssignRequestPO queryQuotationAssignRequestByOrderId(String orderId) {
		return (QuotationAssignRequestPO) session().createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.in(QuotationAssignRequestPO.COLUMN_STATUS_STR, new Short[] { QuotationAssignRequestPO.STATUS_PENDING_INT, QuotationAssignRequestPO.STATUS_ASSIGNED_INT })).setMaxResults(1).uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO queryQuotationAssignRequestByOrderIdAndStatus(String orderId, short status) {
		return (QuotationAssignRequestPO) session().createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_STATUS_STR, status)).setMaxResults(1).uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO pullTopPriorityQuotationAssignRequest(int company, Integer department) {
		org.hibernate.Criteria criteria = session().createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_STATUS_STR, QuotationAssignRequestPO.STATUS_PENDING_INT));

		if (department != null) {
			criteria.add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_DEPARTMENT_STR, department));
		}

		criteria.addOrder(Order.asc("priority"));
		criteria.addOrder(Order.asc("requestTime"));
		criteria.setMaxResults(1);

		return (QuotationAssignRequestPO) criteria.uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO pullTopPriorityQuotationAssignRequestByTypes(int company, Integer department, List<Short> supportedTypes) {
		// 使用 SQL 查询，因为需要 JOIN quotationassignuserruletype 表
		String sql = "SELECT bar.* FROM quotation.quotationassignrequest bar " + "INNER JOIN quotation.quotationassignuserruletype qaurtype ON bar.decorationType = qaurtype.type " + "WHERE bar.status = :status " + "AND bar.company = :company " + "AND qaurtype.type IN (:types) ";

		if (department != null) {
			sql += "AND (bar.department IS NULL OR bar.department = :department) ";
		}

		sql += "ORDER BY bar.priority ASC, bar.requestTime ASC " + "LIMIT 1 FOR UPDATE";

		SQLQuery query = session().createSQLQuery(sql);
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
	public List<QuotationAssignRequestPO> queryPendingQuotationAssignRequestQueue(int company, Integer department) {
		org.hibernate.Criteria criteria = session().createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_STATUS_STR, QuotationAssignRequestPO.STATUS_PENDING_INT));

		if (department != null) {
			criteria.add(Restrictions.eq(QuotationAssignRequestPO.COLUMN_DEPARTMENT_STR, department));
		}

		criteria.addOrder(Order.asc("priority"));
		criteria.addOrder(Order.asc("requestTime"));

		return criteria.list();
	}

	@Override
	public int countPendingQuotationAssignRequestQueue(int company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRequestPO WHERE company = :company AND status = :status";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("status", QuotationAssignRequestPO.STATUS_PENDING_INT).uniqueResult()).intValue();
	}

	@Override
	public int countPendingQuotationAssignRequestQueueByDepartment(int company, int department) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRequestPO WHERE company = :company AND department = :department AND status = :status";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("department", department).setParameter("status", QuotationAssignRequestPO.STATUS_PENDING_INT).uniqueResult()).intValue();
	}

	@Override
	public int getQuotationAssignRequestQueuePosition(int company, Timestamp requestTime) {
		String hql = "SELECT COUNT(*) + 1 FROM QuotationAssignRequestPO " + "WHERE company = :company AND status = :status " + "AND (priority < :priority OR (priority = :priority AND requestTime < :requestTime))";

		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("status", QuotationAssignRequestPO.STATUS_PENDING_INT).setParameter("priority", QuotationAssignRequestPO.PRIORITY_NORMAL_INT).setParameter("requestTime", requestTime).uniqueResult()).intValue();
	}

	@Override
	public int updateQuotationAssignRequestStatus(long qarid, short status) {
		String hql = "UPDATE QuotationAssignRequestPO SET status = :status, assignTime = CURRENT_TIMESTAMP WHERE qarid = :qarid";
		return session().createQuery(hql).setParameter("status", status).setParameter("qarid", qarid).executeUpdate();
	}

	@Override
	public int batchUpdateExpiredQuotationAssignRequestStatus(int company, Timestamp beforeTime, short oldStatus, short newStatus) {
		String hql = "UPDATE QuotationAssignRequestPO SET status = :newStatus WHERE company = :company AND status = :oldStatus AND requestTime < :beforeTime";
		return session().createQuery(hql).setParameter("newStatus", newStatus).setParameter("company", company).setParameter("oldStatus", oldStatus).setParameter("beforeTime", beforeTime).executeUpdate();
	}

	@Override
	public int existQuotationAssignRequestInQueue(String orderId, short status) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRequestPO WHERE orderId = :orderId AND status = :status";
		return ((Number) session().createQuery(hql).setParameter("orderId", orderId).setParameter("status", status).uniqueResult()).intValue();
	}

	@Override
	public int deleteQuotationAssignRequestByOrderIdAndStatus(String orderId, short status) {
		String hql = "DELETE FROM QuotationAssignRequestPO WHERE orderId = :orderId AND status = :status";
		return session().createQuery(hql).setParameter("orderId", orderId).setParameter("status", status).executeUpdate();
	}
}
