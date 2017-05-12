package com.fanglin.inventory.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.ApprovalSalesRefundPO;

public interface ApprovalSalesRefundDao extends Dao<ApprovalSalesRefundPO>{
	
	public ApprovalSalesRefundPO queryApprovalSalesRefundByAId(int aId);

}
