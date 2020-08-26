package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationMatchingVO implements Serializable{

	private static final long serialVersionUID = 3595233427267249608L;

	private Long dmid;

	private String name;

	private Short type;
	
	private Short typeness;

	private Integer base;

	private Integer discount;

	private Integer material;

	private Integer service;

	private Short vision;

	private String comment;

	private Integer company;
	
	public DecorationMatchingVO() {
		super();
	}

	public DecorationMatchingVO(Long dmid) {
		super();
		this.dmid = dmid;
	}

	public Long getDmid() {
		return dmid;
	}

	public void setDmid(Long dmid) {
		this.dmid = dmid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getTypeness() {
		return typeness;
	}

	public void setTypeness(Short typeness) {
		this.typeness = typeness;
	}

	public Integer getBase() {
		return base;
	}

	public void setBase(Integer base) {
		this.base = base;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getMaterial() {
		return material;
	}

	public void setMaterial(Integer material) {
		this.material = material;
	}

	public Integer getService() {
		return service;
	}

	public void setService(Integer service) {
		this.service = service;
	}

	public Short getVision() {
		return vision;
	}

	public void setVision(Short vision) {
		this.vision = vision;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
