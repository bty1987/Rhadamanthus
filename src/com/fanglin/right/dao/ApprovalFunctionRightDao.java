package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.ApprovalFunctionRightPO;

public interface ApprovalFunctionRightDao extends Dao<ApprovalFunctionRightPO> {

	public List<ApprovalFunctionRightPO> queryApprovalFunctionRight(String name);

	public int deleteApprovalFunctionRightByName(String name);

}
