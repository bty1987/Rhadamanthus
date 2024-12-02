package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.po.CustomerOriginPO;

@Entity
@Table(name = "approvalCustomerOrigin", catalog = "approval")
public class ApprovalCustomerOriginAO implements Serializable {

	private static final long serialVersionUID = -4327950869950843118L;

	private long acoid;

	private ApprovalPO approval;

	private CustomerOriginPO customerOrigin;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acoid")
	public long getAcoid() {
		return acoid;
	}

	public void setAcoid(long acoid) {
		this.acoid = acoid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public ApprovalPO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalPO approval) {
		this.approval = approval;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "csid", referencedColumnName = "coid")
	public CustomerOriginPO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginPO customerOrigin) {
		this.customerOrigin = customerOrigin;
	}

}
