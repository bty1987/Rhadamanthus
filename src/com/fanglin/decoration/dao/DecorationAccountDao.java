package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationAccountPO;

public interface DecorationAccountDao extends Dao<DecorationAccountPO>{
	
	public DecorationAccountPO queryDecorationAccount(String orderId);
	
}
