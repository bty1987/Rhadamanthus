/**
 * Title: UserApproveService
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.vo.ApproverVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;

import com.fanglin.utils.Paging;

public interface ApproverService {
	
	public void pageApprover(Paging paging, List<Filter> filters,int company);
	
	public List<ApproverVO> queryApprovalUserByType(ApproverVO userApproveVO,int company);
	
	public int addApprover(ApproverVO userApproveVO) throws FLException;

	public void deleteApprover(List<Integer> ids);

	public void deleteApproverById(Integer approveId);
}
