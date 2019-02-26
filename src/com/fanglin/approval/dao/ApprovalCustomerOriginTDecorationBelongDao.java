package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationBelongPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalCustomerOriginTDecorationBelongDao extends Dao<ApprovalCustomerOriginTDecorationBelongPO> {
	
	public ApprovalCustomerOriginTDecorationBelongPO queryApprovalCustomerOriginTDecorationBelongByAid(long aid);

}
