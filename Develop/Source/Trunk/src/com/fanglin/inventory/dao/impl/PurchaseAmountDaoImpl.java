/**
 * @File Name		: PurchaseAmountDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-10-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PurchaseAmountDao;
import com.fanglin.inventory.po.PurchaseAmountPO;

@Repository("purchaseAmountDao")
public class PurchaseAmountDaoImpl extends DaoImpl<PurchaseAmountPO> implements PurchaseAmountDao {
	
	public PurchaseAmountDaoImpl(){
		super(PurchaseAmountPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<PurchaseAmountPO> queryPurchaseAmount() {
		return session().createCriteria(PurchaseAmountPO.class).list();
	}

	@Override
	public PurchaseAmountPO queryPurchaseAmountByMonth(String month) {
		return (PurchaseAmountPO) session().createCriteria(PurchaseAmountPO.class).add(Restrictions.eq(PurchaseAmountPO.COLUMN_MONTH_STR, month)).uniqueResult();
	}

}
