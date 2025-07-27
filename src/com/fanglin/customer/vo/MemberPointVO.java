package com.fanglin.customer.vo;

import java.io.Serializable;

public class MemberPointVO implements Serializable {

	private static final long serialVersionUID = 3664853442454373491L;

	private String orderId;

	private Long decorationPoint;

	private Long freezeDecorationPoint;

	private Long materialPoint;

	private Long freezeMaterialPoint;

	private Long operatePoint;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getDecorationPoint() {
		return decorationPoint;
	}

	public void setDecorationPoint(Long decorationPoint) {
		this.decorationPoint = decorationPoint;
	}

	public Long getFreezeDecorationPoint() {
		return freezeDecorationPoint;
	}

	public void setFreezeDecorationPoint(Long freezeDecorationPoint) {
		this.freezeDecorationPoint = freezeDecorationPoint;
	}

	public Long getMaterialPoint() {
		return materialPoint;
	}

	public void setMaterialPoint(Long materialPoint) {
		this.materialPoint = materialPoint;
	}

	public Long getFreezeMaterialPoint() {
		return freezeMaterialPoint;
	}

	public void setFreezeMaterialPoint(Long freezeMaterialPoint) {
		this.freezeMaterialPoint = freezeMaterialPoint;
	}

	public Long getOperatePoint() {
		return operatePoint;
	}

	public void setOperatePoint(Long operatePoint) {
		this.operatePoint = operatePoint;
	}

}
