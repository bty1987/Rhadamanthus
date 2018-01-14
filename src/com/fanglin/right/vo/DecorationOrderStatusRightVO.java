package com.fanglin.right.vo;

public class DecorationOrderStatusRightVO implements java.io.Serializable {

	private static final long serialVersionUID = 6305916799344593507L;

	private Integer dosrId;
	
	private Integer uid;
	
	private String status;
	
	public Integer getDosrId() {
		return this.dosrId;
	}

	public void setDosrId(Integer dosrId) {
		this.dosrId = dosrId;
	}

	public Integer getUid() {
		return this.uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}