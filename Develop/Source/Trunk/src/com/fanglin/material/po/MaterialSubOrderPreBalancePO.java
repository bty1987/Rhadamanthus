package com.fanglin.material.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialsuborderprebalance", catalog = "platform")
public class MaterialSubOrderPreBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -7169809440225703812L;

	private int msoprbId;
	
	private long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private Timestamp createTime;
	
	private float preBalance;
	
	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "msoprbId")
	public int getMsoprbId(){
		return this.msoprbId;
	}

	public void setMsoprbId(int msoprbId){
		this.msoprbId = msoprbId;
	}

	@Column(name = "msoId")
	public long getMsoId(){
		return this.msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	@Column(name = "msoNo")
	public String getMsoNo(){
		return this.msoNo;
	}

	public void setMsoNo(String msoNo){
		this.msoNo = msoNo;
	}

	@Column(name = "userId")
	public String getUserId(){
		return this.userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	@Column(name = "userName")
	public String getUserName(){
		return this.userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@Column(name = "preBalance")
	public float getPreBalance(){
		return this.preBalance;
	}

	public void setPreBalance(float preBalance){
		this.preBalance = preBalance;
	}

	@Column(name = "status")
	public short getStatus(){
		return this.status;
	}

	public void setStatus(short status){
		this.status = status;
	}

}