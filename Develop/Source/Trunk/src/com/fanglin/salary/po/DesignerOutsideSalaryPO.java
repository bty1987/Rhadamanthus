package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "designeroutsidesalary", catalog = "platform")
public class DesignerOutsideSalaryPO implements java.io.Serializable {

	private static final long serialVersionUID = -3678880641510340882L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_DSID_STR = "dsId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final int STATUS_INIT_INT = 0;
	
	public static final int STATUS_PAYOFF_INT = 1;

	private int dosId;
	
	private int dsId;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private float outside;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dosId")
	public int getDosId() {
		return this.dosId;
	}

	public void setDosId(int dosId) {
		this.dosId = dosId;
	}

	@Column(name = "dsId")
	public int getDsId() {
		return this.dsId;
	}

	public void setDsId(int dsId) {
		this.dsId = dsId;
	}

	@Column(name = "userId")
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column(name = "userName")
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "outside")
	public float getOutside() {
		return this.outside;
	}

	public void setOutside(float outside) {
		this.outside = outside;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}