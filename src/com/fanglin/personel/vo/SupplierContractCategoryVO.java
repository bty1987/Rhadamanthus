package com.fanglin.personel.vo;

import java.io.Serializable;

public class SupplierContractCategoryVO implements Serializable {

	private static final long serialVersionUID = -3873476866237850519L;

	private long sccid;

	private long scbid; 
	
	private String name;

	private Short ctype;// 结算类型 , 0: 底价 , 1: 点位

	private String cvalue;// 结算值
		
	public SupplierContractCategoryVO() {
		super();
	}

	public long getSccid() {
		return sccid;
	}

	public void setSccid(long sccid) {
		this.sccid = sccid;
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

	public String getCvalue() {
		return cvalue;
	}

	public void setCvalue(String cvalue) {
		this.cvalue = cvalue;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
