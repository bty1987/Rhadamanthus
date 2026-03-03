package com.fanglin.approval.vo;

public class ApprovalProtationPreferVO implements java.io.Serializable {

	private static final long serialVersionUID = 8890451893384226674L;

	private Long appid;

	private Long aid;

	private Long pid;

	private Long ppid;

	private Integer preferPrice;

	private Integer managePrefer;

	private Integer advancePrefer;

	private Integer taxPrice;

	private Integer totalPrice;

	private Integer activityPrice;

	private Short type;

	public Long getAppid() {
		return appid;
	}

	public void setAppid(Long appid) {
		this.appid = appid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public Integer getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Integer preferPrice) {
		this.preferPrice = preferPrice;
	}

	public Integer getManagePrefer() {
		return managePrefer;
	}

	public void setManagePrefer(Integer managePrefer) {
		this.managePrefer = managePrefer;
	}

	public Integer getAdvancePrefer() {
		return advancePrefer;
	}

	public void setAdvancePrefer(Integer advancePrefer) {
		this.advancePrefer = advancePrefer;
	}

	public Integer getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(Integer taxPrice) {
		this.taxPrice = taxPrice;
	}

	public Integer getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Integer totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Integer getActivityPrice() {
		return activityPrice;
	}

	public void setActivityPrice(Integer activityPrice) {
		this.activityPrice = activityPrice;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}