package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalCustomerOriginAO;
import com.fanglin.approval.po.ApprovalCustomerOriginPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalCustomerOriginDao extends Dao<ApprovalCustomerOriginPO> {

	public List<ApprovalCustomerOriginAO> pageApprovalCustomerOrigin(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public ApprovalCustomerOriginPO queryCustomerOriginByAid(long aid);

}
