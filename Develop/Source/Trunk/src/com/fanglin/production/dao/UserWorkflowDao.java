package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.UserWorkflowPO;

public interface UserWorkflowDao  extends Dao<UserWorkflowPO> {

	public List<UserWorkflowPO> queryUserWorkflowByUid(long uid);
	
	public int deleteUserWorkflowByUId(long uid);
	
}
