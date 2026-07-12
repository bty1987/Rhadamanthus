/**
 * @File Name		: NodeCompletionResult.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 节点完成判定结果。描述一次审批动作后,当前节点处于何种状态。
 */

package com.fanglin.approval.engine;

import java.util.List;

/**
 * 节点完成判定结果。
 */
public class NodeCompletionResult {

	/** 节点状态:进行中(本节点尚未达成完成条件) */
	public static final short NODE_RUNNING = 0;

	/** 节点状态:已通过(进入下一节点) */
	public static final short NODE_PASSED = 1;

	/** 节点状态:已驳回(按 rejectStrategy 处理) */
	public static final short NODE_REJECTED = 2;

	private short nodeStatus;

	/** 需要失效的其余任务 taskId 列表(或签通过/并签完成时,其余待办需置为已失效) */
	private List<Long> invalidTaskIds;

	public NodeCompletionResult(short nodeStatus, List<Long> invalidTaskIds) {
		this.nodeStatus = nodeStatus;
		this.invalidTaskIds = invalidTaskIds;
	}

	public short getNodeStatus() {
		return nodeStatus;
	}

	public List<Long> getInvalidTaskIds() {
		return invalidTaskIds;
	}

}
