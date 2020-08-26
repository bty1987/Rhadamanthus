package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalSalesDaymentPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalSalesDaymentDao extends Dao<ApprovalSalesDaymentPO>{
	
	public ApprovalSalesDaymentPO querySalesDaymentByAid(long aid);
	  
}
