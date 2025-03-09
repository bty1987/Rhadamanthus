package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalDecorationContractPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalDecorationContractDao extends Dao<ApprovalDecorationContractPO> {

	public ApprovalDecorationContractPO queryApprovalDecorationContractByAid(long aid);

}
