package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceCutpayDao;
import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("balanceCutpayDao")
public class BalanceCutpayDaoImpl extends DaoImpl<BalanceCutpayPO> implements BalanceCutpayDao {

	public BalanceCutpayDaoImpl() {
		super(BalanceCutpayPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<BalanceCutpayPO> queryBalanceCutpay(long bid) {
		
		return session().createCriteria(BalanceCutpayPO.class).add(Restrictions.eq("balance.bid", bid)).list();
	}
	

}
