package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "designersalary", catalog = "platform")
public class DesignerSalaryPO implements java.io.Serializable {

	private static final long serialVersionUID = 296513431597297003L;
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_PAYOFF_INT = 1;
	
	public static final int STATUS_TYPE_UNPAYOFF_INT = 2;
	
	public static final String COLUMN_DSID_STR = "dsId";
	
	public static final String COLUMN_USERID_STR = "userId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	private int dsId;
	
	private int pdsId;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private String endTime;
	
	private float material;
	
	private float deduct;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "endTime")
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "material")
	public float getMaterial() {
		return this.material;
	}

	public void setMaterial(float material) {
		this.material = material;
	}

	@Column(name = "deduct")
	public float getDeduct() {
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

	@Column(name = "pdsId")
	public int getPdsId() {
		return pdsId;
	}

	public void setPdsId(int pdsId) {
		this.pdsId = pdsId;
	}

}