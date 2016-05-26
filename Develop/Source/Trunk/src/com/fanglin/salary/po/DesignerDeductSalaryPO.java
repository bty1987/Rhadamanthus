package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "designerdeductsalary", catalog = "platform")
public class DesignerDeductSalaryPO implements java.io.Serializable {

	private static final long serialVersionUID = 7390064577294465248L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_PAYOFF_INT = 1;
	
	public static final int TYPE_TYPE_ADDREDUCE_INT = 1;
	
	public static final String COLUMN_DSID_STR = "dsId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_USERID_STR = "userId";
	
	public static final String COLUMN_TYPE_STR = "type";

	private int ddsId;
	
	private int dsId;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private int type;
	
	private float deduct;
	
	private int status;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ddsId")
	public int getDdsId() {
		return this.ddsId;
	}

	public void setDdsId(int ddsId) {
		this.ddsId = ddsId;
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

	@Column(name = "deduct")
	public Float getDeduct() {
		return this.deduct;
	}

	public void setDeduct(float deduct) {
		this.deduct = deduct;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "type")
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Column(name = "des")
	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}