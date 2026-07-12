/**
 * @File Name		: ApprovalFormVO.java
 * @Package   		: com.fanglin.approval.vo
 * @Version			: 1.0
 * @Description		: 审批表单定义 VO
 */

package com.fanglin.approval.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ApprovalFormVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long formId;

	private String code;

	private String name;

	private Long flowId;

	private Short status;

	private Integer company;

	private String comment;

	private Timestamp createTime;

	public ApprovalFormVO() {
		super();
	}

	public Long getFormId() {
		return formId;
	}

	public void setFormId(Long formId) {
		this.formId = formId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getFlowId() {
		return flowId;
	}

	public void setFlowId(Long flowId) {
		this.flowId = flowId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
