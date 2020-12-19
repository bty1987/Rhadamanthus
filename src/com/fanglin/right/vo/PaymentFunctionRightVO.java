package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.payment.vo.PaymentFunctionVO;

public class PaymentFunctionRightVO implements Serializable {
	
	private static final long serialVersionUID = 6937141072493000492L;

	private Long pfrid;
	
	private String name;
	
	private PaymentFunctionVO paymentFunction;
	
	private Short type; 
	
	private int company;
	
	public PaymentFunctionRightVO() {
		super();
	}

	public PaymentFunctionRightVO(PaymentFunctionVO paymentFunction) {
		super();
		this.paymentFunction = paymentFunction;
	}

	public Long getPfrid() {
		return pfrid;
	}

	public void setPfrid(Long pfrid) {
		this.pfrid = pfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PaymentFunctionVO getPaymentFunction() {
		return paymentFunction;
	}

	public void setPaymentFunction(PaymentFunctionVO paymentFunction) {
		this.paymentFunction = paymentFunction;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
