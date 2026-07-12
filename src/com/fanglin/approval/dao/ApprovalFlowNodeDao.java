/**
 * @File Name		: ApprovalFlowNodeDao.java
 * @Package   		: com.fanglin.approval.dao
 * @Version			: 1.0
 * @Description		: 审批流程节点定义 DAO
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.core.dao.Dao;

public interface ApprovalFlowNodeDao extends Dao<ApprovalFlowNodePO> {

	/**
	 * 查询流程下所有启用节点,按 nodeSeq 升序。
	 */
	public List<ApprovalFlowNodePO> queryApprovalFlowNodeByFlowId(long flowId);

	public int deleteApprovalFlowNodeByFlowId(long flowId);

}
