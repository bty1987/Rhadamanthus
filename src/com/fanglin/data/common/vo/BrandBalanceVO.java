package com.fanglin.data.common.vo;

import java.io.Serializable;

public class BrandBalanceVO implements Serializable {

	private static final long serialVersionUID = 3235527825221523951L;

	private Long bbid;
	
	private Long bid;
	
	private String name;
	
	private Short ctype;
	
	private Integer cvalue;
	
	private String comment;

	public BrandBalanceVO() {
		super();
	}

	public Long getBbid() {
		return bbid;
	}

	public void setBbid(Long bbid) {
		this.bbid = bbid;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
