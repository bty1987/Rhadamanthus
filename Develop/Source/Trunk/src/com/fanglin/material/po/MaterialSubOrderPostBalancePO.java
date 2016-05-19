package com.fanglin.material.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialsuborderpostbalance", catalog = "platform")
public class MaterialSubOrderPostBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -6853342238903753347L;

	private int msopobId;
	
	private long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private Timestamp createTime;
	
	private float postBalance;
	
	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "msopobId")
	public int getMsopobId(){
		return this.msopobId;
	}

	public void setMsopobId(int msopobId){
		this.msopobId = msopobId;
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

	@Column(name = "postBalance")
	public float getPostBalance(){
		return this.postBalance;
	}

	public void setPostBalance(float postBalance){
		this.postBalance = postBalance;
	}

	@Column(name = "status")
	public short getStatus(){
		return this.status;
	}

	public void setStatus(short status){
		this.status = status;
	}

}