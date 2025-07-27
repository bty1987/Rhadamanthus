package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSelectionRecordVO;

public interface BalanceSelectionRecordService {

	public List<BalanceSelectionRecordVO> queryBalanceAccount(BalanceSelectionRecordVO balanceSelectionRecordVO);

}
