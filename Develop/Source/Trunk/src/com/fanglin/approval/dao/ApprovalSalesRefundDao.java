package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalSalesRefundDao extends Dao<ApprovalSalesRefundPO>{
	
	public ApprovalSalesRefundPO queryApprovalSalesRefundByAId(int aId);

}
