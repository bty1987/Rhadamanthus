package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalCustomerSourcePO;
import com.fanglin.core.dao.Dao;

public interface ApprovalCustomerSourceDao extends Dao<ApprovalCustomerSourcePO> {

	public ApprovalCustomerSourcePO queryCustomerSourceByAid(long aid);

}
