package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalFunctionPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalFunctionDao extends Dao<ApprovalFunctionPO> {

	public List<ApprovalFunctionPO> queryApprovalFunction(Short type, String fieldType);

}
