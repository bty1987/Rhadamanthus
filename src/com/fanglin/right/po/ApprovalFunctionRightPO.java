package com.fanglin.right.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.approval.po.ApprovalFunctionPO;

@Entity
@Table(name = "approvalfunctionright", catalog = "platform")
public class ApprovalFunctionRightPO implements java.io.Serializable {

	private static final long serialVersionUID = -8242479609649554467L;

	private long cfrid;

	private String name;

	private ApprovalFunctionPO approvalFunction;

	private int company;

	public ApprovalFunctionRightPO() {
		super();
	}

	public ApprovalFunctionRightPO(long cfrid, String name, ApprovalFunctionPO approvalFunction, int company) {

		super();

		this.cfrid = cfrid;
		this.name = name;
		this.approvalFunction = approvalFunction;
		this.company = company;
	}

	@Id
	@GeneratedValue
	@Column(name = "pid")
	public long getCfrid() {
		return cfrid;
	}

	public void setCfrid(long cfrid) {
		this.cfrid = cfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cfid", referencedColumnName = "cfid")
	public ApprovalFunctionPO getApprovalFunction() {
		return approvalFunction;
	}

	public void setApprovalFunction(ApprovalFunctionPO approvalFunction) {
		this.approvalFunction = approvalFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
