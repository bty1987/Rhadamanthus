package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalCustomerOriginPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalCustomerOriginDao extends Dao<ApprovalCustomerOriginPO> {

	public ApprovalCustomerOriginPO queryCustomerOriginByAid(long aid);

}
