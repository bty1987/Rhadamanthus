package com.fanglin.log.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class LoginLogVO implements Serializable {
	
	private static final long serialVersionUID = -8993777631048468322L;
	
	private Long llId;

	private String id;
	
	private String loginId;

	private Timestamp loginTime;

	private String sourceIp;
	
	private int successFlag;

	public LoginLogVO() {
		super();
	}

	public LoginLogVO(String loginId, String sourceIp, Timestamp loginTime) {
		super();
		this.loginId = loginId;
		this.loginTime = loginTime;
		this.sourceIp = sourceIp;
	}

	public Long getLlId() {
		return llId;
	}

	public void setLlId(Long llId) {
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

	@JSON(format="yyyy-MM-dd")
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
