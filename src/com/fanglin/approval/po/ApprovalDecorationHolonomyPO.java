package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationholonomy", catalog = "approval")
public class ApprovalDecorationHolonomyPO implements Serializable {

	private static final long serialVersionUID = -4327950869950843118L;

	private long adhid;

	private long aid;

	private String orderId;

	private long materialPrice;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adhid")
	public long getAdhid() {
		return adhid;
	}

	public void setAdhid(long adhid) {
		this.adhid = adhid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "materialPrice")
	public long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(long materialPrice) {
		this.materialPrice = materialPrice;
	}
}
