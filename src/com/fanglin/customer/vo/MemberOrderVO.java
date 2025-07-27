package com.fanglin.customer.vo;

import java.io.Serializable;

public class MemberOrderVO implements Serializable {

	private static final long serialVersionUID = -3219416154463042718L;

	private String orderId;

	private String pointOrderId; //积分订单号

	private Integer decorationPoint; // 扣除装修积分

	private Integer materialPoint; // 扣除主材积分

	private Integer operatePoint; // 扣除运营积分

	private Integer surplusPoint; // 剩余运营积分
	
	private Integer point; //扣除装修积分+扣除主材积分

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getPointOrderId() {
		return pointOrderId;
	}

	public void setPointOrderId(String pointOrderId) {
		this.pointOrderId = pointOrderId;
	}

	public Integer getDecorationPoint() {
		return decorationPoint;
	}

	public void setDecorationPoint(Integer decorationPoint) {
		this.decorationPoint = decorationPoint;
	}

	public Integer getMaterialPoint() {
		return materialPoint;
	}

	public void setMaterialPoint(Integer materialPoint) {
		this.materialPoint = materialPoint;
	}

	public Integer getOperatePoint() {
		return operatePoint;
	}

	public void setOperatePoint(Integer operatePoint) {
		this.operatePoint = operatePoint;
	}

	public Integer getSurplusPoint() {
		return surplusPoint;
	}

	public void setSurplusPoint(Integer surplusPoint) {
		this.surplusPoint = surplusPoint;
	}

	public Integer getPoint() {
		return point;
	}

	public void setPoint(Integer point) {
		this.point = point;
	}
}
