package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationBalancePO;

public interface DecorationBalanceDao extends Dao<DecorationBalancePO> {
	
	public DecorationBalancePO queryDecorationBalance(Long doid);

}
