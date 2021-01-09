package com.fanglin.right.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.payment.po.PaymentFunctionPO;

@Entity
@Table(name = "paymentfunctionright", catalog = "platform")
public class PaymentFunctionRightPO implements Serializable {

	private static final long serialVersionUID = -3968593453689124535L;

	private long pfrid;

	private String name;

	private PaymentFunctionPO paymentFunction;
	
	private short type;

	private int company;

	public PaymentFunctionRightPO() {
		super();
	}

	public PaymentFunctionRightPO(PaymentFunctionPO paymentFunction) {
		super();
		this.paymentFunction = paymentFunction;
	}

	@Id
	@GeneratedValue
	@Column(name = "pfrid")
	public long getPfrid() {
		return pfrid;
	}

	public void setPfrid(long pfrid) {
		this.pfrid = pfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "pfid", referencedColumnName = "pfid")
	public PaymentFunctionPO getPaymentFunction() {
		return paymentFunction;
	}

	public void setPaymentFunction(PaymentFunctionPO paymentFunction) {
		this.paymentFunction = paymentFunction;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
