/**
 * @File Name		: ApprovalFlowNodePO.java
 * @Package   		: com.fanglin.approval.po
 * @Version			: 1.0
 * @Description		: 审批流程节点定义。nodeType 决定串行/并签/或签/会签模式。
 */

package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalFlowNode", catalog = "approval")
public class ApprovalFlowNodePO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 节点类型:串行(单人顺序审批) */
	public static final short NODE_TYPE_SERIAL_INT = 1;

	/** 节点类型:并签(所有人通过才算通过) */
	public static final short NODE_TYPE_COUNTERSIGN_INT = 2;

	/** 节点类型:或签(任一人通过即算通过) */
	public static final short NODE_TYPE_ORSIGN_INT = 3;

	/** 节点类型:会签(按比例通过) */
	public static final short NODE_TYPE_RATIO_INT = 4;

	/** 审批人规则:指定人 */
	public static final short APPROVER_RULE_DESIGNATED_INT = 0;

	/** 审批人规则:直属上级 */
	public static final short APPROVER_RULE_LEADER_INT = 1;

	/** 审批人规则:部门负责人 */
	public static final short APPROVER_RULE_DEPT_MANAGER_INT = 2;

	/** 审批人规则:角色 */
	public static final short APPROVER_RULE_ROLE_INT = 3;

	/** 审批人规则:发起人自选 */
	public static final short APPROVER_RULE_SELF_SELECT_INT = 4;

	/** 审批人规则:表达式 */
	public static final short APPROVER_RULE_EXPRESSION_INT = 5;

	/** 超时动作:无 */
	public static final short AUTO_ACTION_NONE_INT = 0;

	/** 超时动作:自动通过 */
	public static final short AUTO_ACTION_AGREE_INT = 1;

	/** 超时动作:自动拒绝 */
	public static final short AUTO_ACTION_REFUSE_INT = 2;

	/** 驳回策略:整体驳回(终态) */
	public static final short REJECT_TERMINAL_INT = 0;

	/** 驳回策略:回退上一节点 */
	public static final short REJECT_TO_PREV_INT = 1;

	/** 驳回策略:回退发起人 */
	public static final short REJECT_TO_INITIATOR_INT = 2;

	/** 节点状态:启用 */
	public static final short STATUS_ENABLED_INT = 0;

	/** 节点状态:禁用 */
	public static final short STATUS_DISABLED_INT = 1;

	private long nodeId;

	private long flowId;

	private short nodeSeq;

	private String nodeName;

	private short nodeType;

	private short approverRule;

	private String approverData;

	private BigDecimal passRatio;

	private Integer timeoutHours;

	private short autoAction;

	private String skipCondition;

	private String preHandler;

	private String postHandler;

	private short rejectStrategy;

	private short status;

	public ApprovalFlowNodePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "nodeId")
	public long getNodeId() {
		return nodeId;
	}

	public void setNodeId(long nodeId) {
		this.nodeId = nodeId;
	}

	@Column(name = "flowId")
	public long getFlowId() {
		return flowId;
	}

	public void setFlowId(long flowId) {
		this.flowId = flowId;
	}

	@Column(name = "nodeSeq")
	public short getNodeSeq() {
		return nodeSeq;
	}

	public void setNodeSeq(short nodeSeq) {
		this.nodeSeq = nodeSeq;
	}

	@Column(name = "nodeName")
	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	@Column(name = "nodeType")
	public short getNodeType() {
		return nodeType;
	}

	public void setNodeType(short nodeType) {
		this.nodeType = nodeType;
	}

	@Column(name = "approverRule")
	public short getApproverRule() {
		return approverRule;
	}

	public void setApproverRule(short approverRule) {
		this.approverRule = approverRule;
	}

	@Column(name = "approverData")
	public String getApproverData() {
		return approverData;
	}

	public void setApproverData(String approverData) {
		this.approverData = approverData;
	}

	@Column(name = "passRatio")
	public BigDecimal getPassRatio() {
		return passRatio;
	}

	public void setPassRatio(BigDecimal passRatio) {
		this.passRatio = passRatio;
	}

	@Column(name = "timeoutHours")
	public Integer getTimeoutHours() {
		return timeoutHours;
	}

	public void setTimeoutHours(Integer timeoutHours) {
		this.timeoutHours = timeoutHours;
	}

	@Column(name = "autoAction")
	public short getAutoAction() {
		return autoAction;
	}

	public void setAutoAction(short autoAction) {
		this.autoAction = autoAction;
	}

	@Column(name = "skipCondition")
	public String getSkipCondition() {
		return skipCondition;
	}

	public void setSkipCondition(String skipCondition) {
		this.skipCondition = skipCondition;
	}

	@Column(name = "preHandler")
	public String getPreHandler() {
		return preHandler;
	}

	public void setPreHandler(String preHandler) {
		this.preHandler = preHandler;
	}

	@Column(name = "postHandler")
	public String getPostHandler() {
		return postHandler;
	}

	public void setPostHandler(String postHandler) {
		this.postHandler = postHandler;
	}

	@Column(name = "rejectStrategy")
	public short getRejectStrategy() {
		return rejectStrategy;
	}

	public void setRejectStrategy(short rejectStrategy) {
		this.rejectStrategy = rejectStrategy;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
