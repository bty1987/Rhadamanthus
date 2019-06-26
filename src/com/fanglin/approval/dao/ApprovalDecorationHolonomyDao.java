package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalDecorationHolonomyPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalDecorationHolonomyDao extends Dao<ApprovalDecorationHolonomyPO> {

	public ApprovalDecorationHolonomyPO queryApprovalDecorationHolonomyByAId(long aId);
	
}
