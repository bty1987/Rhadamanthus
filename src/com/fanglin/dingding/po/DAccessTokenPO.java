package com.fanglin.dingding.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "daccesstoken", catalog = "hades")
public class DAccessTokenPO implements java.io.Serializable {

	private static final long serialVersionUID = -3332006713016687916L;
	
	public static final String COLUMN_OPERATETIME_STR = "operateTime";
	
	private long datId;
	
	private String accesstoken;
	
	private long operateTime;

	public DAccessTokenPO() {
		super();
	}

	public DAccessTokenPO(String accesstoken, long operateTime) {
		super();
		this.accesstoken = accesstoken;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "datId")
	public long getDatId() {
		return this.datId;
	}

	public void setDatId(long datId) {
		this.datId = datId;
	}

	@Column(name = "accesstoken")
	public String getAccesstoken() {
		return this.accesstoken;
	}

	public void setAccesstoken(String accesstoken) {
		this.accesstoken = accesstoken;
	}

	@Column(name = "operateTime")
	public long getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(long operateTime) {
		this.operateTime = operateTime;
	}

}