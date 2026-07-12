/**
 * @File Name		: ApprovalTaskDao.java
 * @Package   		: com.fanglin.approval.dao
 * @Version			: 1.0
 * @Description		: 审批任务 DAO
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalTaskPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalTaskDao extends Dao<ApprovalTaskPO> {

	/**
	 * 查询某审批单某节点的全部任务(用于并签/或签/会签判定)。
	 */
	public List<ApprovalTaskPO> queryApprovalTaskByAidNode(long aid, long nodeId);

	/**
	 * 查询某审批单的全部任务(按 nodeSeq, actionTime 排序,用于审批轨迹)。
	 */
	public List<ApprovalTaskPO> queryApprovalTaskByAid(long aid);

	/**
	 * 查询某审批人的待办任务。
	 */
	public List<ApprovalTaskPO> queryApprovalTaskByAssignee(String assigneeId, short status);

	/**
	 * 批量失效某节点下的其余待办任务(或签通过/并签完成时调用)。
	 */
	public int invalidPendingTask(long aid, long nodeId, long excludeTaskId);

	/**
	 * 判断某审批单是否已产生流程引擎任务(用于区分走新引擎还是老逻辑)。
	 */
	public boolean hasTask(long aid);

	/**
	 * 按 aid + assigneeId 查询待办任务(钉钉回调无 taskId,靠审批人匹配)。
	 */
	public ApprovalTaskPO queryPendingTask(long aid, String assigneeId);

}
