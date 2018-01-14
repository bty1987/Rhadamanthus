package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class PhoneCallVO implements Serializable {

	private static final long serialVersionUID = 1694518753890907733L;

	private Long pcid;
	
	private String orderId;
	
	private UserVO operater;
	
	private Timestamp operateTime;
	
	private String callbackId;
	
	private String caller;
	
	private String callee;
	
	private Long startTime;
	
	private Long endTime;
	
	private Integer stopReason;
	
	private Integer duration;
	
	private Integer recordType;
	
	private String recordUrl;
	
	private String token;
	
	public PhoneCallVO() {
		super();
	}

	public PhoneCallVO(UserVO operater) {
		super();
		this.operater = operater;
	}

	public Long getPcid() {
		return pcid;
	}

	public void setPcid(Long pcid) {
		this.pcid = pcid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserVO getOperater() {
		return operater;
	}

	public void setOperater(UserVO operater) {
		this.operater = operater;
	}

	@JSON(format="yyyy-MM-dd hh:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public String getCallbackId() {
		return callbackId;
	}

	public void setCallbackId(String callbackId) {
		this.callbackId = callbackId;
	}

	public String getCaller() {
		return caller;
	}

	public void setCaller(String caller) {
		this.caller = caller;
	}

	public String getCallee() {
		return callee;
	}

	public void setCallee(String callee) {
		this.callee = callee;
	}

	public Long getStartTime() {
		return startTime;
	}

	public void setStartTime(Long startTime) {
		this.startTime = startTime;
	}

	public Long getEndTime() {
		return endTime;
	}

	public void setEndTime(Long endTime) {
		this.endTime = endTime;
	}

	public Integer getStopReason() {
		return stopReason;
	}

	public void setStopReason(Integer stopReason) {
		this.stopReason = stopReason;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Integer getRecordType() {
		return recordType;
	}

	public void setRecordType(Integer recordType) {
		this.recordType = recordType;
	}

	public String getRecordUrl() {
		return recordUrl;
	}

	public void setRecordUrl(String recordUrl) {
		this.recordUrl = recordUrl;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
