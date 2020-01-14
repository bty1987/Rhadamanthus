package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSalesDao;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("balanceSalesDao")
public class BalanceSalesDaoImpl extends DaoImpl<BalanceSalesPO> implements BalanceSalesDao {
	
	public BalanceSalesDaoImpl() {
		super(BalanceSalesPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSalesPO> queryBalanceSalesForSales(long bid) {
		return session().createCriteria(BalanceSalesPO.class).createAlias("balance", "balance").add(Restrictions.eq(BalanceSalesPO.COLUMN_BALANCE_BID, bid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSalesPO> queryBalanceSalesForBalance(long bsid) {
		
		return session().createCriteria(BalanceSalesPO.class).createAlias("salesBalance", "salesBalance").add(Restrictions.eq(BalanceSalesPO.COLUMNSALESBALANCE_SBID, bsid)).list();
	}



}
