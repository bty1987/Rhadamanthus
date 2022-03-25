package com.fanglin.customer.vo;

import java.io.Serializable;

public class DecorationActivityVO implements Serializable {

	private static final long serialVersionUID = -2252945398644294071L;

	private String orderId;

	private String decorationActivitys;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getDecorationActivitys() {
		return decorationActivitys;
	}

	public void setDecorationActivitys(String decorationActivitys) {
		this.decorationActivitys = decorationActivitys;
	}

}
