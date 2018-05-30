package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.CartPO;

public interface CartDao extends Dao<CartPO>{

	public List<CartPO> queryCartByUid(long uid);
	
}
