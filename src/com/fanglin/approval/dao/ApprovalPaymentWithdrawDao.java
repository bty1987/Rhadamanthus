package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalPaymentWithdrawPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalPaymentWithdrawDao extends Dao<ApprovalPaymentWithdrawPO> {

	public ApprovalPaymentWithdrawPO queryApprovalPaymentWithdrawByAId(long aId);

}
