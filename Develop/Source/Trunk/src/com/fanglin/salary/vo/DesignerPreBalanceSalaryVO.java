package com.fanglin.salary.vo;


public class DesignerPreBalanceSalaryVO implements java.io.Serializable {

	private static final long serialVersionUID = -2795271366725585181L;

	private int dprbsId;
	
	private int dsId;
	
	private String orderId;
	
	private long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private float preBalance;
	
	private int status;

	public int getDprbsId() {
		return this.dprbsId;
	}

	public void setDprbsId(int dprbsId) {
		this.dprbsId = dprbsId;
	}

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

	public float getPreBalance() {
		return this.preBalance;
	}

	public void setPreBalance(float preBalance) {
		this.preBalance = preBalance;
	}

	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public long getMsoId() {
		return msoId;
	}

	public void setMsoId(long msoId) {
		this.msoId = msoId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getMsoNo() {
		return msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

}