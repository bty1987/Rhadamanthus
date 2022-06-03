package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.core.dao.Dao;

public interface BalanceCutpayDao extends Dao<BalanceCutpayPO> {

	public List<BalanceCutpayPO> queryBalanceCutpay(long bid);
}
