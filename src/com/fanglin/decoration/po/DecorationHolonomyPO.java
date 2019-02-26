package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "decorationholonomy", catalog = "decoration")
public class DecorationHolonomyPO implements java.io.Serializable {

	private static final long serialVersionUID = -301890437525155657L;

	public static final String COLUMN_ORDERID_STR = "decoration.orderId";

	public static final String COLUMN_VILLAGE_STR = "village.no";

	public static final String COLUMN_DESIGNER_STR = "designer.userId";

	public static final String COLUMN_COMPANY_STR = "decoration.company";

	public static final float MONEY_SERVICEPAIDUP_FLOAT = 0f;

	public static final short STATUS_INIT_SHORT = 0;
	
	private long dhid;

	private DecorationPO decoration;

	private String name;

	private float maching;

	private float discount;
	
	private float discountBase; // 基数

	private float projectBase; // 工程基础

	private float projectPrice;

	private float managePrice;

	private float manageRate;

	private float materialPrice;

	private float servicePrice;

	private float serviceRate;

	private float materialPaidup;

	private float servicePaidup;

	private short status;

	public DecorationHolonomyPO() {
		super();
	}

	public DecorationHolonomyPO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dhid")
	public long getDhid() {
		return dhid;
	}

	public void setDhid(long dhid) {
		this.dhid = dhid;
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

	@Column(name = "managePrice")
	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
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

	@Column(name = "materialPaidup")
	public float getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(float materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	@Column(name = "servicePaidup")
	public float getServicePaidup() {
		return servicePaidup;
	}

	public void setServicePaidup(float servicePaidup) {
		this.servicePaidup = servicePaidup;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "discountBase")
	public float getDiscountBase() {
		return discountBase;
	}

	public void setDiscountBase(float discountBase) {
		this.discountBase = discountBase;
	}

	@Column(name = "projectBase")
	public float getProjectBase() {
		return projectBase;
	}

	public void setProjectBase(float projectBase) {
		this.projectBase = projectBase;
	}

}