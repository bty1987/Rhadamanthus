package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceDetailPO;
import com.fanglin.core.dao.Dao;

public interface BalanceDetailDao extends Dao<BalanceDetailPO> {
	
	public List<BalanceDetailPO> queryBalanceDetailForBalance(long bid);
	
}
