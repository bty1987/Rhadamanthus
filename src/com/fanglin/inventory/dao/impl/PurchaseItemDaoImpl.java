package com.fanglin.inventory.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.po.PurchaseItemPO;

@Repository("purchaseItemDao")
public class PurchaseItemDaoImpl extends DaoImpl<PurchaseItemPO> implements PurchaseItemDao {

	public PurchaseItemDaoImpl() {
		super(PurchaseItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PurchaseItemPO> queryPurchaseItemByPid(long pid) {
		return session().createCriteria(PurchaseItemPO.class).add(Restrictions.eq(PurchaseItemPO.COLUMN_PID_STR, pid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PurchaseItemPO> queryPurchaseItemByPids(List<Long> pids) {
		return session().createCriteria(PurchaseItemPO.class).add(Restrictions.in(PurchaseItemPO.COLUMN_PID_STR, pids)).list();
	}
	
	@Override
	public int amountPurchaseItemForNum(long pid) {
		
		String sql = "select sum(surplus) from inventory.purchaseitem where pid = :pid";
		
		BigDecimal sum = (BigDecimal) session().createSQLQuery(sql).setLong("pid", pid).uniqueResult();
	    
	    return sum.intValue();
	}

}
