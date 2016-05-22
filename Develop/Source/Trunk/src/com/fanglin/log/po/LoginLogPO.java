package com.fanglin.log.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "loginLog", catalog = "platform")
public class LoginLogPO implements Serializable {
	
	private static final long serialVersionUID = -8993777631048468332L;
	
	private long llId;

	private String id;
	
	private String loginId;

	private Timestamp loginTime;

	private String sourceIp;
	
	private int successFlag;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "llId") 
	public long getLlId() {
		return llId;
	}

	public void setLlId(long llId) {
		this.llId = llId;
	}

	
	public String getId(){
		return id;
	}

	public void setId(String id){
		this.id = id;
	}

	public String getLoginId(){
		return loginId;
	}

	public void setLoginId(String loginId){
		this.loginId = loginId;
	}

	public Timestamp getLoginTime(){
		return loginTime;
	}

	public void setLoginTime(Timestamp loginTime){
		this.loginTime = loginTime;
	}

	public String getSourceIp(){
		return sourceIp;
	}

	public void setSourceIp(String sourceIp){
		this.sourceIp = sourceIp;
	}

	public int getSuccessFlag(){
		return successFlag;
	}

	public void setSuccessFlag(int successFlag){
		this.successFlag = successFlag;
	}
	
}
