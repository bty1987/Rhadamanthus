package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.ApportDetailPO;
import com.fanglin.core.dao.Dao;

public interface ApportDetailDao extends Dao<ApportDetailPO> {

	public List<ApportDetailPO> queryApportDetailForBalance(long bid);
}
