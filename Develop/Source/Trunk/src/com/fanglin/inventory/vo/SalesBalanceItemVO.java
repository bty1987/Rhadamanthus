package com.fanglin.inventory.vo;

import java.io.Serializable;

public class SalesBalanceItemVO implements Serializable{

	private static final long serialVersionUID = -1711636143764240276L;
	
	private Long sbiid;
	
	private Long sbid;
	
	private SalesItemVO salesItem;
	
	private Short rawCtype;
	
	private Float rawCvalue;
	
	private Short ctype;
	
	private Float cvalue;
	
	private Float num;
	
	private Float total;
	
	public SalesBalanceItemVO() {
		super();
	}

	public SalesBalanceItemVO(SalesItemVO salesItem) {
		super();
		this.salesItem = salesItem;
	}

	public Long getSbiid() {
		return sbiid;
	}

	public void setSbiid(Long sbiid) {
		this.sbiid = sbiid;
	}

	public Long getSbid() {
		return sbid;
	}

	public void setSbid(Long sbid) {
		this.sbid = sbid;
	}

	public SalesItemVO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemVO salesItem) {
		this.salesItem = salesItem;
	}

	public Short getRawCtype() {
		return rawCtype;
	}

	public void setRawCtype(Short rawCtype) {
		this.rawCtype = rawCtype;
	}

	public Float getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(Float rawCvalue) {
		this.rawCvalue = rawCvalue;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Float getCvalue() {
		return cvalue;
	}

	public void setCvalue(Float cvalue) {
		this.cvalue = cvalue;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}
	
}
