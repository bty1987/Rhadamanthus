package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配记录表 DAO 实现 职责: 追溯所有分配尝试（成功、失败、重新分配）
 */
@Repository("quotationAssignRecordDao")
public class QuotationAssignRecordDaoImpl extends DaoImpl<QuotationAssignRecordPO> implements QuotationAssignRecordDao {

	public QuotationAssignRecordDaoImpl() {
		super(QuotationAssignRecordPO.class);
	}

	@Override
	public void pageQuotationAssignRecord(Paging paging, List<Filter> filters, String orderId) {
		// TODO Auto-generated method stub

	}

	@Override
	public void pageQuotationAssignRecord(Paging paging, List<Filter> filters, int uid) {
		// TODO Auto-generated method stub

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecord(String orderId) {
		return session().createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq(QuotationAssignRecordPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.desc("assignTime")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecord(int uid) {
		return session().createCriteria(QuotationAssignRecordPO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).addOrder(Order.desc("assignTime")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecord(String orderId, int limit) {
		return session().createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq(QuotationAssignRecordPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.desc("assignTime")).setMaxResults(limit).list();
	}

}
