/**
 * @File Name	: CleaningConstructionScheduleVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ConstructionScheduleVO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;
	
	private Long csId;
	
	private Long cid;
	
	private String orderId;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private Short status;
	
	private Short checkout;
	
	private Short schedule;

	public Long getCsId() {
		return csId;
	}

	public void setCsId(Long csId) {
		this.csId = csId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}
	
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getCheckout() {
		return checkout;
	}

	public void setCheckout(Short checkout) {
		this.checkout = checkout;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}
	
}
