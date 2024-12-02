package com.fanglin.approval.vo;

import java.io.Serializable;

import com.fanglin.customer.vo.CustomerOriginVO;

public class ApprovalCustomerOriginVO implements Serializable {

	private static final long serialVersionUID = 5937990438453637182L;

	private Long acoid;

	private Long aid;

	private Long csid;

	private CustomerOriginVO customerOrigin;

	private ApprovalVO approval;

	public Long getAcoid() {
		return acoid;
	}

	public void setAcoid(Long acoid) {
		this.acoid = acoid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public CustomerOriginVO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginVO customerOrigin) {
		this.customerOrigin = customerOrigin;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

}
