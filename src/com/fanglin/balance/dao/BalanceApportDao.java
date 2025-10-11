package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceApportPO;
import com.fanglin.core.dao.Dao;

public interface BalanceApportDao extends Dao<BalanceApportPO> {

	public List<BalanceApportPO> queryBalanceApportForBalance(long bid);
}
