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

	@Override
	public List<PurchaseItemPO> queryPurchaseItemByPids(List<Long> pids) {

		List<PurchaseItemPO> purchaseItemPOs = new ArrayList<PurchaseItemPO>();

		for(Long pid : pids){
			purchaseItemPOs.addAll(queryPurchaseItemByPid(pid));
		}

		return purchaseItemPOs;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<PurchaseItemPO> queryPurchaseItemBySiid(long siid) {
		return  session().createCriteria(PurchaseItemPO.class).add(Restrictions.eq(PurchaseItemPO.COLUMN_SIID_STR, siid)).list();
	}

	@Override
	public List<PurchaseItemPO> queryPurchaseItemBySiids(List<Long> siids) {
		
		List<PurchaseItemPO> purchaseItemPOs = new ArrayList<PurchaseItemPO>();

		for(Long siid : siids){
			purchaseItemPOs.addAll(queryPurchaseItemBySiid(siid));
		}

		return purchaseItemPOs;
	}

}
