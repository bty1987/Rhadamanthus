/**
 * Title: ApproveUserDao
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApproveUserPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApproveUserDao extends Dao<ApproveUserPO> {

	public List<ApproveUserPO> pageApproveUser(Paging paging, List<Filter> filters,int company);
	
	public List<ApproveUserPO> queryApproveUserForNameByType(Paging paging, String pinyinName, Short type,int company);
	
	public List<ApproveUserPO> queryApprovalUserByType(short type,int company);
	
	public List<ApproveUserPO> queryApproveUserByUserId(String userId);
}
