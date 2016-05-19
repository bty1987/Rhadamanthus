package com.fanglin.salary.vo;


public class VenderPostBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -4869780162518304955L;

	private Integer vpbId;
	
	private Integer vbId;
	
	private String orderId;
	
	private Long msoId;
	
	private String msoNo;
	
	private Integer materialBrandId;
	
	private String materialBrandName;
	
	private String createTime;
	
	private Float postBalance;
	
	private Integer status;

	public Integer getVpbId() {
		return this.vpbId;
	}

	public void setVpbId(Integer vpbId) {
		this.vpbId = vpbId;
	}

	public Integer getVbId() {
		return this.vbId;
	}

	public void setVbId(Integer vbId) {
		this.vbId = vbId;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(Long msoId) {
		this.msoId = msoId;
	}

	public String getMsoNo() {
		return this.msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

	public Integer getMaterialBrandId() {
		return this.materialBrandId;
	}

	public void setMaterialBrandId(Integer materialBrandId) {
		this.materialBrandId = materialBrandId;
	}

	public String getMaterialBrandName() {
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public Float getPostBalance() {
		return this.postBalance;
	}

	public void setPostBalance(Float postBalance) {
		this.postBalance = postBalance;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}