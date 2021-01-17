package com.fanglin.payment.vo;

public class WalletresVO implements java.io.Serializable {

	private static final long serialVersionUID = -4574415095741170157L;

	private Long wrid;
	
	private Long wid;
	
	private Long picid;
	
	private String name;
	
	private String type;
	
	private String path;
	
	private String comment;

	public WalletresVO() {
		super();
	}

	public Long getWrid() {
		return wrid;
	}

	public void setWrid(Long wrid) {
		this.wrid = wrid;
	}

	public Long getWid() {
		return wid;
	}

	public void setWid(Long wid) {
		this.wid = wid;
	}

	public Long getPicid() {
		return picid;
	}

	public void setPicid(Long picid) {
		this.picid = picid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}