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

	public static final long MONEY_SERVICEPAIDUP_INT = 0;

	public static final short STATUS_INIT_SHORT = 0;

	private long dhid;

	private DecorationPO decoration;

	private String name;

	private int maching;

	private int discount;

	private long discountBase; // 基数

	private long projectBase; // 工程基础

	private long projectPrice;

	private int trafficRate;

	private short trafficDiscount;

	private long managePrice;

	private int manageRate;

	private short manageDiscount;

	private int taxRate;

	private short taxDiscount;

	private long originMaterialPrice;

	private long materialPrice;

	private long servicePrice;

	private int serviceRate;

	private long materialPaidup;

	private long servicePaidup;

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
	public int getMaching() {
		return maching;
	}

	public void setMaching(int maching) {
		this.maching = maching;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "projectPrice")
	public long getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(long projectPrice) {
		this.projectPrice = projectPrice;
	}

	@Column(name = "trafficRate")
	public int getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(int trafficRate) {
		this.trafficRate = trafficRate;
	}

	@Column(name = "trafficDiscount")
	public short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
	}

	@Column(name = "managePrice")
	public long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(long managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "taxRate")
	public int getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(int taxRate) {
		this.taxRate = taxRate;
	}

	@Column(name = "taxDiscount")
	public short getTaxDiscount() {
		return taxDiscount;
	}

	public void setTaxDiscount(short taxDiscount) {
		this.taxDiscount = taxDiscount;
	}

	@Column(name = "originMaterialPrice")
	public long getOriginMaterialPrice() {
		return originMaterialPrice;
	}

	public void setOriginMaterialPrice(long originMaterialPrice) {
		this.originMaterialPrice = originMaterialPrice;
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

	@Column(name = "serviceRate")
	public int getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(int serviceRate) {
		this.serviceRate = serviceRate;
	}

	@Column(name = "materialPaidup")
	public long getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(long materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	@Column(name = "servicePaidup")
	public long getServicePaidup() {
		return servicePaidup;
	}

	public void setServicePaidup(long servicePaidup) {
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
	public long getDiscountBase() {
		return discountBase;
	}

	public void setDiscountBase(long discountBase) {
		this.discountBase = discountBase;
	}

	@Column(name = "projectBase")
	public long getProjectBase() {
		return projectBase;
	}

	public void setProjectBase(long projectBase) {
		this.projectBase = projectBase;
	}

}