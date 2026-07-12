/**
 * @File Name		: ApprovalFlowVO.java
 * @Package   		: com.fanglin.approval.vo
 * @Version			: 1.0
 * @Description		: 审批流程定义 VO
 */

package com.fanglin.approval.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ApprovalFlowVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long flowId;

	private String code;

	private String name;

	private Short businessType;

	private Integer version;

	private Short status;

	private Integer company;

	private String comment;

	private Timestamp createTime;

	public ApprovalFlowVO() {
		super();
	}

	public Long getFlowId() {
		return flowId;
	}

	public void setFlowId(Long flowId) {
		this.flowId = flowId;
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

	public Short getBusinessType() {
		return businessType;
	}

	public void setBusinessType(Short businessType) {
		this.businessType = businessType;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
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
