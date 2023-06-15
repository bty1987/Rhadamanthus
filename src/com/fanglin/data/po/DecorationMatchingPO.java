package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationmatching", catalog = "data")
public class DecorationMatchingPO implements Serializable {

	private static final long serialVersionUID = 4438560163739528951L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_TYPENESS_STR = "typeness";

	private long dmid;

	private String name;

	private short type;

	private short typeness;

	private int base;

	private int discount;

	private int material;

	private int service;

	private short vision;

	private short isShow;

	private short trafficDiscount;

	private short manageDiscount;

	private short taxDiscount;

	private String comment;

	private int company;

	public DecorationMatchingPO() {
		super();
	}

	public DecorationMatchingPO(long dmid) {
		super();
		this.dmid = dmid;
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "typeness")
	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

	@Column(name = "base")
	public int getBase() {
		return base;
	}

	public void setBase(int base) {
		this.base = base;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "material")
	public int getMaterial() {
		return material;
	}

	public void setMaterial(int material) {
		this.material = material;
	}

	@Column(name = "service")
	public int getService() {
		return service;
	}

	public void setService(int service) {
		this.service = service;
	}

	@Column(name = "vision")
	public short getVision() {
		return vision;
	}

	public void setVision(short vision) {
		this.vision = vision;
	}

	@Column(name = "isShow")
	public short getIsShow() {
		return isShow;
	}

	public void setIsShow(short isShow) {
		this.isShow = isShow;
	}

	@Column(name = "trafficDiscount")
	public short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
	}

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "taxDiscount")
	public short getTaxDiscount() {
		return taxDiscount;
	}

	public void setTaxDiscount(short taxDiscount) {
		this.taxDiscount = taxDiscount;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
