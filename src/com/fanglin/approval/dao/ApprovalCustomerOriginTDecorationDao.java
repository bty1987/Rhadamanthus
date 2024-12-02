package com.fanglin.approval.dao;

import java.util.List;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalCustomerOriginTDecorationDao extends Dao<ApprovalCustomerOriginTDecorationPO> {
	
	public List<ApprovalCustomerOriginTDecorationPO> pageApprovalCustomerOriginTDecorationPO(Paging paging, List<Filter> filters, Integer company) throws FLException;

	
	public ApprovalCustomerOriginTDecorationPO queryCustomerOriginTDecorationByAid(long aid);

}
