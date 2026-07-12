/**
 * @File Name		: ApprovalFormPO.java
 * @Package   		: com.fanglin.approval.po
 * @Version			: 1.0
 * @Description		: 审批表单定义(元信息)。通过 flowId 桥接 approvalFlow,
 * 					  一个流程可关联一个表单,表单含多个字段定义(approvalFormField)。
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
@Table(name = "approvalForm", catalog = "approval")
public class ApprovalFormPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final short STATUS_ENABLED_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	private long formId;

	private String code;

	private String name;

	private Long flowId;

	private short status;

	private int company;

	private String comment;

	private Timestamp createTime;

	public ApprovalFormPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "formId")
	public long getFormId() {
		return formId;
	}

	public void setFormId(long formId) {
		this.formId = formId;
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

	@Column(name = "flowId")
	public Long getFlowId() {
		return flowId;
	}

	public void setFlowId(Long flowId) {
		this.flowId = flowId;
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
