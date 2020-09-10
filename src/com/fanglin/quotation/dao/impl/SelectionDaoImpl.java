package com.fanglin.quotation.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.po.SelectionPO;

@Repository("selectionDao")
public class SelectionDaoImpl extends DaoImpl<SelectionPO> implements SelectionDao {

	public SelectionDaoImpl() {
		super(SelectionPO.class);
	}

	@Override
	public SelectionPO querySelectionByQid(long qid) {
		return (SelectionPO) createCriteria(SelectionPO.class).add(Restrictions.eq(SelectionPO.COLUMN_QID_STR, qid)).uniqueResult();
	}

	@Override
	public int updateSelectionForQidByOrderId(String orderId, long qid) {

		String sql = "update quotation.selection set qid = :qid where orderId = :orderId";
		session().createSQLQuery(sql).setLong(SelectionPO.COLUMN_QID_STR, qid).setString(SelectionPO.COLUMN_ORDERID_STR, orderId).executeUpdate();

		return 0;
	}

	@Override
	public SelectionPO querySelectionByOrderId(String orderId) {
		return (SelectionPO) createCriteria(SelectionPO.class).add(Restrictions.eq(SelectionPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public int deleteSelectionByQid(long qid) {

		String sql = "delete from quotation.selection where qid = :qid";
		session().createSQLQuery(sql).setLong(SelectionPO.COLUMN_QID_STR, qid).executeUpdate();

		return 0;
	}

}
