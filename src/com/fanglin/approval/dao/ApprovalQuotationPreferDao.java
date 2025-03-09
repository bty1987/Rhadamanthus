package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalQuotationPreferPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalQuotationPreferDao extends Dao<ApprovalQuotationPreferPO> {

	public ApprovalQuotationPreferPO queryApprovalQuotationPreferByAid(long aid);

}
