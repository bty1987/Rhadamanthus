package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;

/**
 * 装修单预算分配记录表 DAO 实现
 */
@Repository("quotationAssignRecordDao")
public class QuotationAssignRecordDaoImpl extends DaoImpl<QuotationAssignRecordPO> implements QuotationAssignRecordDao {

	public QuotationAssignRecordDaoImpl() {
		super(QuotationAssignRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> findByOrderId(String orderId) {
		return createCriteria(QuotationAssignRecordPO.class)
				.add(Restrictions.eq("orderId", orderId))
				.addOrder(Order.desc("assignTime"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> findByUid(Integer uid) {
		return createCriteria(QuotationAssignRecordPO.class)
				.add(Restrictions.eq("uid", uid))
				.addOrder(Order.desc("assignTime"))
				.list();
	}

	@Override
	public int countSuccessByUid(Integer uid) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignRecordPO WHERE uid = :uid AND assignResult = :result";
		return ((Number) getSession().createQuery(hql)
				.setParameter("uid", uid)
				.setParameter("result", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT)
				.uniqueResult()).intValue();
	}

	@Override
	public QuotationAssignRecordPO findLastSuccessByUid(Integer uid) {
		return (QuotationAssignRecordPO) createCriteria(QuotationAssignRecordPO.class)
				.add(Restrictions.eq("uid", uid))
				.add(Restrictions.eq("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT))
				.addOrder(Order.desc("assignTime"))
				.setMaxResults(1)
				.uniqueResult();
	}
}
