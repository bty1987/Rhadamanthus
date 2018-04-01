package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "paymentscaleitem", catalog = "data")
public class PaymentScaleItemPO implements Serializable {

	private static final long serialVersionUID = 4880310559870966082L;
	
	private long psiid;
	
	private	long psid;
	
	private String name;
	
	private int scale;

	public PaymentScaleItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="psiid")
	public long getPsiid() {
		return psiid;
	}

	public void setPsiid(long psiid) {
		this.psiid = psiid;
	}
	@Column(name="psid")
	public long getPsid() {
		return psid;
	}

	public void setPsid(long psid) {
		this.psid = psid;
	}
	
	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	@Column(name="scale")
	public int getScale() {
		return scale;
	}

	public void setScale(int scale) {
		this.scale = scale;
	}
	
}
