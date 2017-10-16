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

import com.fanglin.approval.vo.ApproveUserVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;

import com.fanglin.utils.Paging;

public interface ApproveUserService {
	
	public void pageApproveUser(Paging paging, List<Filter> filters,int company);
	
	public List<ApproveUserVO> queryApprovalUserByType(ApproveUserVO userApproveVO,int company);
	
	public int addApproveUser(ApproveUserVO userApproveVO) throws FLException;

	public void deleteApproveUser(List<Integer> ids);

	public void deleteApproveUserById(Integer approveId);
}
