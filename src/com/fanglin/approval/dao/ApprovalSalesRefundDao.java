package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalSalesRefundAO;
import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalSalesRefundDao extends Dao<ApprovalSalesRefundPO> {

	public List<ApprovalSalesRefundAO> pageApprovalSalesRefund(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public ApprovalSalesRefundPO queryApprovalSalesRefundByAId(long aId);

}
