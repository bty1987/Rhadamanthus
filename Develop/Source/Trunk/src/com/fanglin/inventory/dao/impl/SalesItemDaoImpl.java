package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.inventory.po.SalesItemPO;

@Repository("salesItemDao")
public class SalesItemDaoImpl extends DaoImpl<SalesItemPO> implements SalesItemDao {

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesItemPO> querySalesItemBySid(long sid) {
		return (List<SalesItemPO>) createCriteria(SalesItemPO.class).add(Restrictions.eq(SalesItemPO.COLUMN_SID_STR, sid)).list();
	}

	@Override
	public SalesItemPO querySalesItemBySiid(long siid) {
		return (SalesItemPO) createCriteria(SalesItemPO.class).add(Restrictions.eq(SalesItemPO.COLUMN_SIID_STR, siid)).uniqueResult();
	}

	
	

}
