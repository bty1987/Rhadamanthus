package com.fanglin.kingdee.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class KingdeeRecordVO implements Serializable {

	private static final long serialVersionUID = 7465368938250693960L;
	
	private Long krid;
	
	private String orderId;
	
	private Long rtid;
	
	private String type;
	
	private String message;
	
	private Timestamp createTime;

	public KingdeeRecordVO() {
		super();
	}

	public Long getKrid() {
		return krid;
	}

	public void setKrid(Long krid) {
		this.krid = krid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getRtid() {
		return rtid;
	}

	public void setRtid(Long rtid) {
		this.rtid = rtid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
}
