/**
 * @File Name		: ApprovalTaskPO.java
 * @Package   		: com.fanglin.approval.po
 * @Version			: 1.0
 * @Description		: 审批任务(运行时实例)。每个节点的每个审批人一条记录,
 * 					  通过 aid 关联现有 approval 主表,不破坏现有 ApprovalPO 单 receiver 模型。
 */

package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalTask", catalog = "approval")
public class ApprovalTaskPO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 任务状态:待办 */
	public static final short STATUS_PENDING_INT = 0;

	/** 任务状态:通过 */
	public static final short STATUS_AGREE_INT = 1;

	/** 任务状态:拒绝 */
	public static final short STATUS_REFUSE_INT = 2;

	/** 任务状态:转交 */
	public static final short STATUS_TRANSFER_INT = 3;

	/** 任务状态:已失效(并签/或签终结后,其余任务自动失效) */
	public static final short STATUS_INVALID_INT = 4;

	/** 任务状态:超时自动处理 */
	public static final short STATUS_TIMEOUT_INT = 5;

	private long taskId;

	private long aid;

	private long flowId;

	private long nodeId;

	private short nodeSeq;

	private short nodeType;

	private String assigneeId;

	private short status;

	private String action;

	private String comment;

	private String transferTo;

	private Timestamp assignTime;

	private Timestamp actionTime;

	public ApprovalTaskPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "taskId")
	public long getTaskId() {
		return taskId;
	}

	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "flowId")
	public long getFlowId() {
		return flowId;
	}

	public void setFlowId(long flowId) {
		this.flowId = flowId;
	}

	@Column(name = "nodeId")
	public long getNodeId() {
		return nodeId;
	}

	public void setNodeId(long nodeId) {
		this.nodeId = nodeId;
	}

	@Column(name = "nodeSeq")
	public short getNodeSeq() {
		return nodeSeq;
	}

	public void setNodeSeq(short nodeSeq) {
		this.nodeSeq = nodeSeq;
	}

	@Column(name = "nodeType")
	public short getNodeType() {
		return nodeType;
	}

	public void setNodeType(short nodeType) {
		this.nodeType = nodeType;
	}

	@Column(name = "assigneeId")
	public String getAssigneeId() {
		return assigneeId;
	}

	public void setAssigneeId(String assigneeId) {
		this.assigneeId = assigneeId;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "action")
	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "transferTo")
	public String getTransferTo() {
		return transferTo;
	}

	public void setTransferTo(String transferTo) {
		this.transferTo = transferTo;
	}

	@Column(name = "assignTime")
	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	@Column(name = "actionTime")
	public Timestamp getActionTime() {
		return actionTime;
	}

	public void setActionTime(Timestamp actionTime) {
		this.actionTime = actionTime;
	}

}
