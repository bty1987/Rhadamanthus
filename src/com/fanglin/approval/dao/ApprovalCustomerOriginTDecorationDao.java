package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalCustomerOriginTDecorationDao extends Dao<ApprovalCustomerOriginTDecorationPO> {
	
	public ApprovalCustomerOriginTDecorationPO queryCustomerOriginTDecorationByAid(long aid);

}
