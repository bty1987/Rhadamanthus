/**
 * @File Name		: ApprovalTaskVO.java
 * @Package   		: com.fanglin.approval.vo
 * @Version			: 1.0
 * @Description		: 审批任务 VO
 */

package com.fanglin.approval.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ApprovalTaskVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long taskId;

	private Long aid;

	private Long flowId;

	private Long nodeId;

	private Short nodeSeq;

	private Short nodeType;

	private String assigneeId;

	private Short status;

	private String action;

	private String comment;

	private String transferTo;

	private Timestamp assignTime;

	private Timestamp actionTime;

	public ApprovalTaskVO() {
		super();
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getFlowId() {
		return flowId;
	}

	public void setFlowId(Long flowId) {
		this.flowId = flowId;
	}

	public Long getNodeId() {
		return nodeId;
	}

	public void setNodeId(Long nodeId) {
		this.nodeId = nodeId;
	}

	public Short getNodeSeq() {
		return nodeSeq;
	}

	public void setNodeSeq(Short nodeSeq) {
		this.nodeSeq = nodeSeq;
	}

	public Short getNodeType() {
		return nodeType;
	}

	public void setNodeType(Short nodeType) {
		this.nodeType = nodeType;
	}

	public String getAssigneeId() {
		return assigneeId;
	}

	public void setAssigneeId(String assigneeId) {
		this.assigneeId = assigneeId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getTransferTo() {
		return transferTo;
	}

	public void setTransferTo(String transferTo) {
		this.transferTo = transferTo;
	}

	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	public Timestamp getActionTime() {
		return actionTime;
	}

	public void setActionTime(Timestamp actionTime) {
		this.actionTime = actionTime;
	}

}
