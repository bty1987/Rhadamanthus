package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceDetailDao;
import com.fanglin.balance.po.BalanceDetailPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("balanceDetailDao")
public class BalanceDetailDaoImpl extends DaoImpl<BalanceDetailPO> implements BalanceDetailDao {

	public BalanceDetailDaoImpl() {
		super(BalanceDetailPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<BalanceDetailPO> queryBalanceDetailForBalance(long bid) {
		
		return session().createCriteria(BalanceDetailPO.class).add(Restrictions.eq("balance.bid", bid)).list();
	}

}
