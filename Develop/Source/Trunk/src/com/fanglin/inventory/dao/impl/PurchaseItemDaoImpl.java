package com.fanglin.inventory.dao.impl;

import java.util.*;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.po.PurchaseItemPO;

@Repository("purchaseItemDao")
public class PurchaseItemDaoImpl extends DaoImpl<PurchaseItemPO> implements PurchaseItemDao {

	public PurchaseItemDaoImpl(){
		super(PurchaseItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PurchaseItemPO> queryPurchaseItemByPid(long pid) {
		return session().createCriteria(PurchaseItemPO.class).add(Restrictions.eq(PurchaseItemPO.COLUMN_PID_STR, pid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PurchaseItemPO> queryPurchaseItemByPids(List<Long> pids) {

		return session().createCriteria(PurchaseItemPO.class).add(Restrictions.in(PurchaseItemPO.COLUMN_PID_STR, pids)).list();
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<PurchaseItemPO> queryPurchaseItemBySiids(List<Long> siids) {
		
		return session().createCriteria(PurchaseItemPO.class).add(Restrictions.in(PurchaseItemPO.COLUMN_SIID_STR, siids)).list();
		
	}

}
