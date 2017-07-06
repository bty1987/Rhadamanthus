package com.fanglin.approval.vo;

public class ApprovalSalesDiscountVO implements java.io.Serializable {

	private static final long serialVersionUID = 711873433253802459L;
	
	private Integer asdid;
	
	private Integer aid;

	private Long sid;

	private Float referMoney;


	public ApprovalSalesDiscountVO() {
		super();
	}


	public Integer getAsdid() {
		return asdid;
	}


	public void setAsdid(Integer asdid) {
		this.asdid = asdid;
	}


	public Integer getAid() {
		return aid;
	}


	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Float getReferMoney() {
		return referMoney;
	}


	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}

}