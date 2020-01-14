/**
 * Title: ApproverDao
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApproverPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApproverDao extends Dao<ApproverPO> {

	public List<ApproverPO> pageApprover(Paging paging, List<Filter> filters, int company);

	public List<ApproverPO> queryApproverByType(short type, int company);

	public List<ApproverPO> queryApproverByUserId(String userId, int company);

	public ApprovalPO queryApprovalByType(String userId, short type, int company);
}
