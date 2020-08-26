/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "decorationmidpack", catalog = "decoration")
public class DecorationMidpackPO implements Serializable {

	private static final long serialVersionUID = -6559570220039192269L;
	
	public static final long MONEY_SERVICEPAIDUP_INT = 0;
	
	public static final short STATUS_INIT_SHORT = 0;

	private long dmid;
	
	private DecorationPO decoration;
	
	private String name;
	
	private long materialPrice;
	
	private long servicePrice;
	
	private long materialPaidup;
	
	private short status;

	
	public DecorationMidpackPO() {
		super();
	}

	public DecorationMidpackPO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dmid")
	public long getDmid() {
		return dmid;
	}

	public void setDmid(long dmid) {
		this.dmid = dmid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "materialPrice")
	public long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(long materialPrice) {
		this.materialPrice = materialPrice;
	}

	@Column(name = "servicePrice")
	public long getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(long servicePrice) {
		this.servicePrice = servicePrice;
	}

	@Column(name = "materialPaidup")
	public long getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(long materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
