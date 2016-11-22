package com.fanglin.decoration.vo;

import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class DecorationOperateVO implements java.io.Serializable {

	private static final long serialVersionUID = 3315950278291481859L;
	
	private Long doId;
	
	private DecorationOrderVO decorationOrder;
	
	private UserVO targer;
	
	private UserVO sourcer;
	
	private UserVO operater;
	
	private Timestamp operateTime;
	
	private Float value;
	
	private Short type;
	
	private Short status;
	
	private String des;

	public Long getDoId() {
		return doId;
	}

	public void setDoId(Long doId) {
		this.doId = doId;
	}

	public DecorationOrderVO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderVO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}

	public UserVO getSourcer() {
		return sourcer;
	}

	public void setSourcer(UserVO sourcer) {
		this.sourcer = sourcer;
	}

	public UserVO getTarger() {
		return targer;
	}

	public void setTarger(UserVO targer) {
		this.targer = targer;
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

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}