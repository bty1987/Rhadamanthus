package com.fanglin.personel.vo;

import java.io.Serializable;

public class SupplierBrandProductVO implements Serializable {

	private static final long serialVersionUID = -3873476866237850519L;

	private long sbpid;

	private long scbid; 
	
	private String name;

	private Short ctype;// 结算类型 , 0: 底价 , 1: 点位

	private Integer cvalue;// 结算值

	private Integer breakpay;// 违约金
	
	private Integer warranTime; // 质保期
	
	public SupplierBrandProductVO() {
		super();
	}

	public long getSbpid() {
		return sbpid;
	}

	public void setSbpid(long sbpid) {
		this.sbpid = sbpid;
	}

	public long getScbid() {
		return scbid;
	}

	public void setScbid(long scbid) {
		this.scbid = scbid;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

	public Integer getBreakpay() {
		return breakpay;
	}

	public void setBreakpay(Integer breakpay) {
		this.breakpay = breakpay;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getWarranTime() {
		return warranTime;
	}

	public void setWarranTime(Integer warranTime) {
		this.warranTime = warranTime;
	}
	
	

}
