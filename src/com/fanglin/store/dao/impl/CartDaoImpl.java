package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.CartDao;
import com.fanglin.store.po.CartPO;

@Repository("cartDao")
public class CartDaoImpl extends DaoImpl<CartPO> implements CartDao{

	public CartDaoImpl(){
		super(CartPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<CartPO> queryCartByUid(long uid) {
		return session().createCriteria(CartPO.class).add(Restrictions.eq(CartPO.COLUMN_UID_STR, uid)).list();
	}

}
