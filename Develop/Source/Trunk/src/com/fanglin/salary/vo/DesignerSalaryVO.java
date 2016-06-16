package com.fanglin.salary.vo;


public class DesignerSalaryVO implements java.io.Serializable {

	private static final long serialVersionUID = -6890778572962358229L;

	private int dsId;
	
	private int pdsId;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private String endTime;
	
	private float material;
	
	private float deduct;
	
	private int status;

	public int getDsId() {
		return this.dsId;
	}

	public void setDsId(int dsId) {
		this.dsId = dsId;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public float getMaterial() {
		return this.material;
	}

	public void setMaterial(float material) {
		this.material = material;
	}

	public float getDeduct() {
		return this.deduct;
	}

	public void setDeduct(float deduct) {
		this.deduct = deduct;
	}

	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getPdsId() {
		return pdsId;
	}

	public void setPdsId(int pdsId) {
		this.pdsId = pdsId;
	}

}