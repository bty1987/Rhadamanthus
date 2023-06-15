package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalDecorationTerminalPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalDecorationTerminalDao extends Dao<ApprovalDecorationTerminalPO>{

	public ApprovalDecorationTerminalPO queryApprovalDecorationTerminalByAId(long aId);
}
