package com.fanglin.decoration.vo;

import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class DecorationOperateVO implements java.io.Serializable {

	private static final long serialVersionUID = 3315950278291481859L;
	
	private Long doid;
	
	private String orderId;
	
	private UserVO operater;
	
	private Timestamp operateTime;
	
	private Float value;
	
	private Short type;
	
	private Short status;
	
	private String comment;

	public Long getDoid() {
		return doid;
	}

	public void setDoid(Long doid) {
		this.doid = doid;
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

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}