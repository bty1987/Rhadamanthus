package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ConstructionVO implements Serializable {
	
	private static final long serialVersionUID = 833120058577492198L;
	
	private Long cid;
	
	private Timestamp createTime;
	
	private String orderId;
	
	public ConstructionVO(){
		super();
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
