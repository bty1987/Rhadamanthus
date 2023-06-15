package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalDecorationTerminalItemPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalDecorationTerminalItemDao extends Dao<ApprovalDecorationTerminalItemPO>{

	public List<ApprovalDecorationTerminalItemPO> queryApprovalDecorationTerminalItemByAdtId(long adtid);
}
