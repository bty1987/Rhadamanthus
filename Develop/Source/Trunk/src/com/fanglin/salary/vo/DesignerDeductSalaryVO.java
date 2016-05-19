package com.fanglin.salary.vo;
// default package

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "designerdeductsalary")
public class DesignerDeductSalaryVO implements java.io.Serializable {

	private static final long serialVersionUID = 3134285650531490325L;

	private int ddsId;
	
	private int dsId;
	
	private long msoId;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private int type;
	
	private float deduct;
	
	private int status;
	
	private String des;

	public int getDdsId() {
		return this.ddsId;
	}

	public void setDdsId(int ddsId) {
		this.ddsId = ddsId;
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

	public Float getDeduct() {
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

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}