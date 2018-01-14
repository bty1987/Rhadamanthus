package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesBalanceItemDao;
import com.fanglin.sales.po.SalesBalanceItemPO;

@Repository("salesBalanceItemDao")
public class SalesBalanceItemDaoImpl extends DaoImpl<SalesBalanceItemPO> implements SalesBalanceItemDao{

	
	public SalesBalanceItemDaoImpl(){
		super(SalesBalanceItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesBalanceItemPO> querySalesBalanceItemBySbid(long sbid) {
		
		return session().createCriteria(SalesBalanceItemPO.class).add(Restrictions.eq(SalesBalanceItemPO.COLUMN_SBID_STR, sbid)).list();
		
	}
}
