package com.fanglin.salary.vo;


public class DesignerOutsideSalaryVO implements java.io.Serializable {

	private static final long serialVersionUID = -3678880641510340882L;

	private Integer dosId;
	
	private Integer dsId;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private Float outside;
	
	private Integer status;

	public Integer getDosId() {
		return dosId;
	}

	public void setDosId(Integer dosId) {
		this.dosId = dosId;
	}

	public Integer getDsId() {
		return dsId;
	}

	public void setDsId(Integer dsId) {
		this.dsId = dsId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public Float getOutside() {
		return outside;
	}

	public void setOutside(Float outside) {
		this.outside = outside;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}