package com.fanglin.salary.vo;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "designerpostbalancesalary")
public class DesignerPostBalanceSalaryVO implements java.io.Serializable {

	private static final long serialVersionUID = -8475822562192039366L;

	private int dpobsId;
	
	private int dsId;
	
	private String orderId;
	
	private long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private Float postBalance;
	
	private int status;

	public int getDpobsId() {
		return this.dpobsId;
	}

	public void setDpobsId(int dpobsId) {
		this.dpobsId = dpobsId;
	}

	public int getDsId() {
		return this.dsId;
	}

	public void setDsId(int dsId) {
		this.dsId = dsId;
	}

	public long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(long msoId) {
		this.msoId = msoId;
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

	public Float getPostBalance() {
		return this.postBalance;
	}

	public void setPostBalance(Float postBalance) {
		this.postBalance = postBalance;
	}

	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
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