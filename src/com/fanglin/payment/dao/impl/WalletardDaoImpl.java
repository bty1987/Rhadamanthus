package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.WalletardDao;
import com.fanglin.payment.po.WalletardPO;

@Repository("walletardardDao")
public class WalletardDaoImpl extends DaoImpl<WalletardPO> implements WalletardDao {

	public WalletardDaoImpl(){
		super(WalletardPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WalletardPO> queryWalletard(Long wid) {
		return session().createCriteria(WalletardPO.class).add(Restrictions.eq("wid", wid)).list();
	}

}
