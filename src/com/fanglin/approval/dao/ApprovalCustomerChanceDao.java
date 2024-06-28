package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalCustomerChancePO;
import com.fanglin.core.dao.Dao;

public interface ApprovalCustomerChanceDao extends Dao<ApprovalCustomerChancePO> {

	public ApprovalCustomerChancePO queryCustomerChanceByAid(long aid);

}
