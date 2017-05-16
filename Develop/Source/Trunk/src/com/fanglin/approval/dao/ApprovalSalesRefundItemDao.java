package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalSalesRefundItemPO;
import com.fanglin.core.dao.Dao;


public interface ApprovalSalesRefundItemDao extends
		Dao<ApprovalSalesRefundItemPO> {

	public List<ApprovalSalesRefundItemPO> queryApprovalSalesRefundItemByAsrId(long asrid);
}
