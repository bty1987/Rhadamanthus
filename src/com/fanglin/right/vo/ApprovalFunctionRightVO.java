package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.approval.vo.ApprovalFunctionVO;

public class ApprovalFunctionRightVO implements Serializable {

	private static final long serialVersionUID = 3349062059352981703L;

	private Long cfrid;

	private String name;

	private ApprovalFunctionVO approvalFunction;

	private int company;

	public ApprovalFunctionRightVO() {
		super();
	}

	public ApprovalFunctionRightVO(ApprovalFunctionVO approvalFunction) {
		super();
		this.approvalFunction = approvalFunction;
	}

	public Long getCfrid() {
		return cfrid;
	}

	public void setCfrid(Long cfrid) {
		this.cfrid = cfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ApprovalFunctionVO getApprovalFunction() {
		return approvalFunction;
	}

	public void setApprovalFunction(ApprovalFunctionVO approvalFunction) {
		this.approvalFunction = approvalFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
