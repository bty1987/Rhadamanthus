package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalSalesDiscountPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalSalesDiscountDao extends Dao<ApprovalSalesDiscountPO>{

	public ApprovalSalesDiscountPO queryApprovalSalesDiscountByAId(long aId);
}
