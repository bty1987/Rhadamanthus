package com.fanglin.decoration.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationAccountDao;
import com.fanglin.decoration.po.DecorationAccountPO;

@Repository("decorationAccountDao")
public class DecorationAccountDaoImpl extends DaoImpl<DecorationAccountPO> implements DecorationAccountDao{

	public DecorationAccountDaoImpl(){
		super(DecorationAccountPO.class);
	}
	
	@Override
	public DecorationAccountPO queryDecorationAccount(String orderId) {
		
		return (DecorationAccountPO) session().createCriteria(DecorationAccountPO.class).add(Restrictions.eq(DecorationAccountPO.DECORATIONACCOUNT_ORDERID_STR, orderId)).uniqueResult();
	
	}

}
