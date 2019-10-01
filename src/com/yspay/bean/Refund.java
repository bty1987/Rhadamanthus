package com.yspay.bean;

public class Refund {

	private String refund_mer_id;

	private Double refund_amount;

	public Refund(String refund_mer_id, Double refund_amount) {
		super();
		this.refund_mer_id = refund_mer_id;
		this.refund_amount = refund_amount;
	}

	public String getRefund_mer_id() {
		return refund_mer_id;
	}

	public void setRefund_mer_id(String refund_mer_id) {
		this.refund_mer_id = refund_mer_id;
	}

	public Double getRefund_amount() {
		return refund_amount;
	}

	public void setRefund_amount(Double refund_amount) {
		this.refund_amount = refund_amount;
	}
}
