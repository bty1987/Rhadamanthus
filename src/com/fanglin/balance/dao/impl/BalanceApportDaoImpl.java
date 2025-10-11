package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceApportDao;
import com.fanglin.balance.po.BalanceApportPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("apportDetailDao")
public class BalanceApportDaoImpl extends DaoImpl<BalanceApportPO> implements BalanceApportDao {

	public BalanceApportDaoImpl() {
		super(BalanceApportPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceApportPO> queryBalanceApportForBalance(long bid) {
		return session().createCriteria(BalanceApportPO.class).add(Restrictions.eq("bid", bid)).list();
	}

}
