package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.WalletresDao;
import com.fanglin.payment.po.WalletresPO;

@Repository("walletresDao")
public class WalletresDaoImpl extends DaoImpl<WalletresPO> implements WalletresDao {

	public WalletresDaoImpl(){
		super(WalletresPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WalletresPO> queryWalletres(Long wid) {
		return session().createCriteria(WalletresPO.class).add(Restrictions.eq("wid", wid)).list();
	}

}
