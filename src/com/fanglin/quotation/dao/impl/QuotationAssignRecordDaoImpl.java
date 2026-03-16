package com.fanglin.quotation.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;

/**
 * 装修单预算分配记录表 DAO 实现 职责: 追溯所有分配尝试（成功、失败、重新分配）
 */
@Repository("quotationAssignRecordDao")
public class QuotationAssignRecordDaoImpl extends DaoImpl<QuotationAssignRecordPO> implements QuotationAssignRecordDao {

	public QuotationAssignRecordDaoImpl() {
		super(QuotationAssignRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecordByOrderId(String orderId) {
		return session().createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq(QuotationAssignRecordPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.desc("assignTime")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecordByUid(int uid) {
		return session().createCriteria(QuotationAssignRecordPO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).addOrder(Order.desc("assignTime")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryRecentQuotationAssignRecordByOrderId(String orderId, int limit) {
		return session().createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq(QuotationAssignRecordPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.desc("assignTime")).setMaxResults(limit).list();
	}

	@Override
	public int countSuccessQuotationAssignRecordByUid(int uid) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRecordPO WHERE user.uid = :uid AND assignResult = :assignResult";
		return ((Number) session().createQuery(hql).setParameter("uid", uid).setParameter("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT).uniqueResult()).intValue();
	}

	@Override
	public int countFailQuotationAssignRecordByUid(int uid) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRecordPO WHERE user.uid = :uid AND assignResult = :assignResult";
		return ((Number) session().createQuery(hql).setParameter("uid", uid).setParameter("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_FAIL_INT).uniqueResult()).intValue();
	}

	@Override
	public QuotationAssignRecordPO queryLastSuccessQuotationAssignRecordByUid(int uid) {
		return (QuotationAssignRecordPO) session().createCriteria(QuotationAssignRecordPO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).add(Restrictions.eq("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT)).addOrder(Order.desc("assignTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public QuotationAssignRecordPO queryLastQuotationAssignRecordByUid(int uid) {
		return (QuotationAssignRecordPO) session().createCriteria(QuotationAssignRecordPO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).addOrder(Order.desc("assignTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecordByOrderIdAndUid(String orderId, int uid) {
		return session().createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq(QuotationAssignRecordPO.COLUMN_ORDERID_STR, orderId)).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).addOrder(Order.desc("assignTime")).list();
	}

	@Override
	public int countQuotationAssignRecordByUidAndTimeRange(int uid, Timestamp startTime, Timestamp endTime) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRecordPO WHERE user.uid = :uid AND assignTime >= :startTime AND assignTime <= :endTime";
		return ((Number) session().createQuery(hql).setParameter("uid", uid).setParameter("startTime", startTime).setParameter("endTime", endTime).uniqueResult()).intValue();
	}

	@Override
	public QuotationAssignRecordPO querySuccessQuotationAssignRecordByOrderId(String orderId) {
		return (QuotationAssignRecordPO) session().createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq(QuotationAssignRecordPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT)).addOrder(Order.desc("assignTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public int existSuccessQuotationAssignRecord(String orderId) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRecordPO WHERE orderId = :orderId AND assignResult = :assignResult";
		return ((Number) session().createQuery(hql).setParameter("orderId", orderId).setParameter("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT).uniqueResult()).intValue();
	}

	@Override
	public int deleteQuotationAssignRecordByOrderId(String orderId) {
		String hql = "DELETE FROM QuotationAssignRecordPO WHERE orderId = :orderId";
		return session().createQuery(hql).setParameter("orderId", orderId).executeUpdate();
	}

	@Override
	public int batchDeleteQuotationAssignRecordBeforeTime(Timestamp beforeTime) {
		String hql = "DELETE FROM QuotationAssignRecordPO WHERE assignTime < :beforeTime";
		return session().createQuery(hql).setParameter("beforeTime", beforeTime).executeUpdate();
	}
}
