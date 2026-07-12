/**
 * @File Name		: ApprovalFormFieldDao.java
 * @Package   		: com.fanglin.approval.dao
 * @Version			: 1.0
 * @Description		: 审批表单字段定义 DAO
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalFormFieldPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalFormFieldDao extends Dao<ApprovalFormFieldPO> {

	/** 查询表单下所有启用字段,按 sortOrder 升序 */
	public List<ApprovalFormFieldPO> queryApprovalFormFieldByFormId(long formId);

	public int deleteApprovalFormFieldByFormId(long formId);

}
