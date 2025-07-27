package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceSelectionRecordPO;
import com.fanglin.core.dao.Dao;

public interface BalanceSelectionRecordDao extends Dao<BalanceSelectionRecordPO> {

	public List<BalanceSelectionRecordPO> queryBalanceSelectionRecord(long bsid);

}
