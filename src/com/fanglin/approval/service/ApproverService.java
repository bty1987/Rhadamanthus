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

	public void pageApprover(Paging paging, List<Filter> filters, int company);

	public List<ApproverVO> queryApproverByType(ApproverVO approver, int company);

	public int addApprover(ApproverVO approver, int company) throws FLException;

	public void deleteApprover(ApproverVO approver) throws FLException;

}
