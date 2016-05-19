package com.fanglin.finance.vo;

public class SubjectVO implements java.io.Serializable {

	private static final long serialVersionUID = -262771861763073661L;

	private Long sid;
	
	private Short level;
	
	private String oneCode;
	
	private String twoCode;
	
	private String thrCode;
	
	private String name;
	
	private Short status;

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
	}

	public String getOneCode() {
		return oneCode;
	}

	public void setOneCode(String oneCode) {
		this.oneCode = oneCode;
	}

	public String getTwoCode() {
		return twoCode;
	}

	public void setTwoCode(String twoCode) {
		this.twoCode = twoCode;
	}

	public String getThrCode() {
		return thrCode;
	}

	public void setThrCode(String thrCode) {
		this.thrCode = thrCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}