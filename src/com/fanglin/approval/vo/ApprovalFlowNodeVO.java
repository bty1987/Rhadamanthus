/**
 * @File Name		: ApprovalFlowNodeVO.java
 * @Package   		: com.fanglin.approval.vo
 * @Version			: 1.0
 * @Description		: 审批流程节点定义 VO
 */

package com.fanglin.approval.vo;

import java.io.Serializable;
import java.math.BigDecimal;

public class ApprovalFlowNodeVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long nodeId;

	private Long flowId;

	private Short nodeSeq;

	private String nodeName;

	private Short nodeType;

	private Short approverRule;

	private String approverData;

	private BigDecimal passRatio;

	private Integer timeoutHours;

	private Short autoAction;

	private String skipCondition;

	private String preHandler;

	private String postHandler;

	private Short rejectStrategy;

	private Short status;

	public ApprovalFlowNodeVO() {
		super();
	}

	public Long getNodeId() {
		return nodeId;
	}

	public void setNodeId(Long nodeId) {
		this.nodeId = nodeId;
	}

	public Long getFlowId() {
		return flowId;
	}

	public void setFlowId(Long flowId) {
		this.flowId = flowId;
	}

	public Short getNodeSeq() {
		return nodeSeq;
	}

	public void setNodeSeq(Short nodeSeq) {
		this.nodeSeq = nodeSeq;
	}

	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	public Short getNodeType() {
		return nodeType;
	}

	public void setNodeType(Short nodeType) {
		this.nodeType = nodeType;
	}

	public Short getApproverRule() {
		return approverRule;
	}

	public void setApproverRule(Short approverRule) {
		this.approverRule = approverRule;
	}

	public String getApproverData() {
		return approverData;
	}

	public void setApproverData(String approverData) {
		this.approverData = approverData;
	}

	public BigDecimal getPassRatio() {
		return passRatio;
	}

	public void setPassRatio(BigDecimal passRatio) {
		this.passRatio = passRatio;
	}

	public Integer getTimeoutHours() {
		return timeoutHours;
	}

	public void setTimeoutHours(Integer timeoutHours) {
		this.timeoutHours = timeoutHours;
	}

	public Short getAutoAction() {
		return autoAction;
	}

	public void setAutoAction(Short autoAction) {
		this.autoAction = autoAction;
	}

	public String getSkipCondition() {
		return skipCondition;
	}

	public void setSkipCondition(String skipCondition) {
		this.skipCondition = skipCondition;
	}

	public String getPreHandler() {
		return preHandler;
	}

	public void setPreHandler(String preHandler) {
		this.preHandler = preHandler;
	}

	public String getPostHandler() {
		return postHandler;
	}

	public void setPostHandler(String postHandler) {
		this.postHandler = postHandler;
	}

	public Short getRejectStrategy() {
		return rejectStrategy;
	}

	public void setRejectStrategy(Short rejectStrategy) {
		this.rejectStrategy = rejectStrategy;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
