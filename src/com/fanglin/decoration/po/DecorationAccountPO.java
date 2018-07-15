package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationaccount", catalog = "decoration")
public class DecorationAccountPO implements Serializable{

	private static final long serialVersionUID = -2745701305737937262L;
	
	public static final String DECORATIONACCOUNT_ORDERID_STR = "orderId";

	private long daid;
	
	private String orderId;
	
	private short type;
	
	private float maching;
	
	private float discount;
	
	private float projectPrice;
	
	private float materialPrice;
	
	private float servicePrice;
	
	private float serviceRate;
	
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daid") 
	public long getDaid() {
		return daid;
	}

	public void setDaid(long daid) {
		this.daid = daid;
	}
	
	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "maching")
	public float getMaching() {
		return maching;
	}

	public void setMaching(float maching) {
		this.maching = maching;
	}

	@Column(name = "discount")
	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}

	@Column(name = "projectPrice")
	public float getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(float projectPrice) {
		this.projectPrice = projectPrice;
	}

	@Column(name = "materialPrice")
	public float getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(float materialPrice) {
		this.materialPrice = materialPrice;
	}

	@Column(name = "servicePrice")
	public float getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(float servicePrice) {
		this.servicePrice = servicePrice;
	}

	@Column(name = "serviceRate")
	public float getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(float serviceRate) {
		this.serviceRate = serviceRate;
	}
	
	
	
}
