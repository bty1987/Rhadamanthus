package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.ApprovalSalesRefundItemPO;

public interface ApprovalSalesRefundItemDao extends
		Dao<ApprovalSalesRefundItemPO> {

	public List<ApprovalSalesRefundItemPO> queryApprovalSalesRefundItemByAsrId(long asrid);
}
