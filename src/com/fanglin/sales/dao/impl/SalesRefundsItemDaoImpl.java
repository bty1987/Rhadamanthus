package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesRefundsItemDao;
import com.fanglin.sales.po.SalesRefundsItemPO;

@Repository("RefundsItemDao")
public class SalesRefundsItemDaoImpl extends DaoImpl<SalesRefundsItemPO> implements SalesRefundsItemDao {

	public SalesRefundsItemDaoImpl() {
		super(SalesRefundsItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesRefundsItemPO> querySalesRefundsItemBySid(long sid) {
		return session().createCriteria(SalesRefundsItemPO.class).add(Restrictions.eq(SalesRefundsItemPO.COLUMN_SID_STR, sid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesRefundsItemPO> querySalesRefundsItemByRid(long rid) {
		return session().createCriteria(SalesRefundsItemPO.class).add(Restrictions.eq(SalesRefundsItemPO.COLUMN_RID_STR, rid)).list();
	}

}
