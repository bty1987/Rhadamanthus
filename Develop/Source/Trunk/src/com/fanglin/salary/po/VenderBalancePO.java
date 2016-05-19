package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "venderbalance", catalog = "platform")
public class VenderBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -1043217252290250118L;
	
	public static String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static int STATUS_TYPE_INIT_INT = 0;
	
	public static int STATUS_TYPE_PAYOFF_INT = 1;
	
	public static String COLUMN_VBID_STR = "vbId";
	
	public static String COLUMN_MATERIALBRANDID_STR = "materialBrandId";
	
	public static String COLUMN_MATERIALBRANDNAME_STR = "materialBrandName";
	
	public static String COLUMN_STATUS_STR = "status";

	private int vbId;
	
	private int materialBrandId;
	
	private String materialBrandName;
	
	private String createTime;
	
	private String endTime;
	
	private float balance;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vbId")
	public int getVbId() {
		return this.vbId;
	}

	public void setVbId(int vbId) {
		this.vbId = vbId;
	}

	@Column(name = "materialBrandId")
	public int getMaterialBrandId() {
		return this.materialBrandId;
	}

	public void setMaterialBrandId(int materialBrandId) {
		this.materialBrandId = materialBrandId;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName() {
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "endTime")
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "balance")
	public float getBalance() {
		return this.balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}