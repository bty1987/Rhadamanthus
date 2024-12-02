package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.SelectionItemStatusRightDao;
import com.fanglin.right.po.SelectionItemStatusRightPO;

@Repository("selectionItemStatusRightDao")
public class SelectionItemStatusRightDaoImpl extends DaoImpl<SelectionItemStatusRightPO> implements SelectionItemStatusRightDao {
	public SelectionItemStatusRightDaoImpl() {
		super(SelectionItemStatusRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SelectionItemStatusRightPO> querySelectionItemStatusRight(long bid) {
		return session().createCriteria(SelectionItemStatusRightPO.class).add(Restrictions.eq(SelectionItemStatusRightPO.COLUMN_BID_STR, bid)).list();
	}

	@Override
	public void deleteSelectionItemStatus(Long bid) {

		String sql = "delete from platform.selectionitemstatusright where bid = :bid";

		session().createSQLQuery(sql).setLong("bid", bid).executeUpdate();

	}

}
