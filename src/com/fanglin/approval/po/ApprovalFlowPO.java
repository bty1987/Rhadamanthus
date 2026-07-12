/**
 * @File Name		: ApprovalFlowPO.java
 * @Package   		: com.fanglin.approval.po
 * @Version			: 1.0
 * @Description		: 审批流程定义。一个 businessType+company 对应一条启用流程。
 * 					  不改动现有 approval/process 表,作为流程引擎的定义层叠加。
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
@Table(name = "approvalFlow", catalog = "approval")
public class ApprovalFlowPO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 状态:启用 */
	public static final short STATUS_ENABLED_INT = 0;

	/** 状态:禁用 */
	public static final short STATUS_DISABLED_INT = 1;

	private long flowId;

	private String code;

	private String name;

	private short businessType;

	private int version;

	private short status;

	private int company;

	private String comment;

	private Timestamp createTime;

	public ApprovalFlowPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "flowId")
	public long getFlowId() {
		return flowId;
	}

	public void setFlowId(long flowId) {
		this.flowId = flowId;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "businessType")
	public short getBusinessType() {
		return businessType;
	}

	public void setBusinessType(short businessType) {
		this.businessType = businessType;
	}

	@Column(name = "version")
	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
