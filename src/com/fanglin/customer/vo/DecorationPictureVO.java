package com.fanglin.customer.vo;

import java.io.Serializable;

public class DecorationPictureVO implements Serializable {

	private static final long serialVersionUID = 2651769309574589072L;

	private String orderId;

	private String name;

	private String path;

	private Integer type;

	public DecorationPictureVO() {
		super();
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

}
