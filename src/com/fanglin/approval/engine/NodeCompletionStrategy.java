/**
 * @File Name		: NodeCompletionStrategy.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 节点完成判定策略。根据节点类型(串行/并签/或签/会签)和当前动作(agree/refuse),
 * 					  判定节点是"通过/驳回/进行中",并给出需要失效的其余任务。
 * 					  <p>核心算法:
 * 					  <ul>
 * 					    <li>串行(1):单任务节点,任何动作即终结节点</li>
 * 					    <li>并签(2):agree 需全员通过;任一 refuse 即驳回</li>
 * 					    <li>或签(3):任一 agree 即通过;任一 refuse 不立即驳回(继续等其他人的 agree)</li>
 * 					    <li>会签(4):agree 比例 >= passRatio 即通过</li>
 * 					  </ul>
 */

package com.fanglin.approval.engine;

import java.util.ArrayList;
import java.util.List;

import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.approval.po.ApprovalTaskPO;

public class NodeCompletionStrategy {

	/**
	 * 判定节点状态。
	 *
	 * @param node        节点定义(提供 nodeType / passRatio)
	 * @param allTasks    本节点全部任务(含历史动作)
	 * @param currentTask 当前触发动作的任务(已更新状态)
	 * @param action      动作:"agree" 或 "refuse"
	 * @return 节点判定结果
	 */
	public NodeCompletionResult judge(ApprovalFlowNodePO node, List<ApprovalTaskPO> allTasks, ApprovalTaskPO currentTask, String action) {

		List<Long> invalidIds = new ArrayList<Long>();

		// 任何类型的节点,只要出现 refuse 动作,都视为驳回(后续 rejectStrategy 决定回退还是终态)
		if ("refuse".equals(action)) {
			return new NodeCompletionResult(NodeCompletionResult.NODE_REJECTED, collectOtherPending(allTasks, currentTask));
		}

		// agree 动作,按节点类型判定
		short nodeType = node.getNodeType();

		switch (nodeType) {
			case ApprovalFlowNodePO.NODE_TYPE_SERIAL_INT:
				// 串行:单任务,agree 即节点通过
				invalidIds = collectOtherPending(allTasks, currentTask);
				return new NodeCompletionResult(NodeCompletionResult.NODE_PASSED, invalidIds);

			case ApprovalFlowNodePO.NODE_TYPE_ORSIGN_INT:
				// 或签:任一 agree 即通过,其余待办失效
				invalidIds = collectOtherPending(allTasks, currentTask);
				return new NodeCompletionResult(NodeCompletionResult.NODE_PASSED, invalidIds);

			case ApprovalFlowNodePO.NODE_TYPE_COUNTERSIGN_INT: {
				// 并签:需全部通过
				int agreed = 0;
				int total = allTasks.size();
				for (ApprovalTaskPO t : allTasks) {
					if (t.getStatus() == ApprovalTaskPO.STATUS_AGREE_INT) {
						agreed++;
					}
				}
				if (agreed >= total) {
					return new NodeCompletionResult(NodeCompletionResult.NODE_PASSED, invalidIds);
				}
				return new NodeCompletionResult(NodeCompletionResult.NODE_RUNNING, invalidIds);
			}

			case ApprovalFlowNodePO.NODE_TYPE_RATIO_INT: {
				// 会签:按比例
				int agreed = 0;
				int total = allTasks.size();
				for (ApprovalTaskPO t : allTasks) {
					if (t.getStatus() == ApprovalTaskPO.STATUS_AGREE_INT) {
						agreed++;
					}
				}
				double ratio = total == 0 ? 0 : (double) agreed / total;
				double required = node.getPassRatio() == null ? 1.0 : node.getPassRatio().doubleValue();
				if (ratio >= required) {
					invalidIds = collectOtherPending(allTasks, currentTask);
					return new NodeCompletionResult(NodeCompletionResult.NODE_PASSED, invalidIds);
				}
				return new NodeCompletionResult(NodeCompletionResult.NODE_RUNNING, invalidIds);
			}

			default:
				// 未知类型按串行处理
				return new NodeCompletionResult(NodeCompletionResult.NODE_PASSED, collectOtherPending(allTasks, currentTask));
		}
	}

	/**
	 * 收集本节点中除当前任务外的其余待办任务(用于或签通过/串行通过后失效其余)。
	 */
	private List<Long> collectOtherPending(List<ApprovalTaskPO> allTasks, ApprovalTaskPO currentTask) {

		List<Long> ids = new ArrayList<Long>();

		for (ApprovalTaskPO t : allTasks) {
			if (t.getTaskId() != currentTask.getTaskId() && t.getStatus() == ApprovalTaskPO.STATUS_PENDING_INT) {
				ids.add(t.getTaskId());
			}
		}

		return ids;
	}

}
