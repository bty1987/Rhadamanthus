package com.fanglin.common.vo;

public class ReceiptTypeVO implements java.io.Serializable {

	private static final long serialVersionUID = 186150588872194351L;

	private Integer rtId;
	
	private String name;
	
	private String key;
	
	private String subjectName;
	
	private String oneCode;
	
	private String twoCode;
	
	private String thrCode;
	
	private Short direction;
	
	private Short type;
	
	private Short status;

	public Integer getRtId() {
		return this.rtId;
	}

	public void setRtId(Integer rtId) {
		this.rtId = rtId;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKey() {
		return this.key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getSubjectName() {
		return this.subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public String getOneCode() {
		return this.oneCode;
	}

	public void setOneCode(String oneCode) {
		this.oneCode = oneCode;
	}

	public String getTwoCode() {
		return this.twoCode;
	}

	public void setTwoCode(String twoCode) {
		this.twoCode = twoCode;
	}

	public String getThrCode() {
		return this.thrCode;
	}

	public void setThrCode(String thrCode) {
		this.thrCode = thrCode;
	}

	public Short getDirection() {
		return this.direction;
	}

	public void setDirection(Short direction) {
		this.direction = direction;
	}

	public Short getType() {
		return this.type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}