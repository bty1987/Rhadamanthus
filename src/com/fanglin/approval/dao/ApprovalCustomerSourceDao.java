package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalCustomerSourceAO;
import com.fanglin.approval.po.ApprovalCustomerSourcePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalCustomerSourceDao extends Dao<ApprovalCustomerSourcePO> {

	public List<ApprovalCustomerSourceAO> pageApprovalCustomerSource(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public ApprovalCustomerSourcePO queryApprovalCustomerSourceByAid(long aid);

}
