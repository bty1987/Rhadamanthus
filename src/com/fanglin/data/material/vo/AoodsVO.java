package com.fanglin.data.material.vo;

import java.io.Serializable;

public class AoodsVO implements Serializable {

	private static final long serialVersionUID = -7147159224652861599L;

	private Long aid;
	
	private GoodsVO goods;
	
	private AccessoriesTypeVO accessoriesType;
	
	private Short checkup;
	
	private Short status;
	
	private Integer company;
	
	private String bompany;
	
	private Long gid;
	
	private String name;
	
	public AoodsVO(){
		super();
	}

	public AoodsVO(GoodsVO goods, AccessoriesTypeVO accessoriesType) {
		super();
		this.goods = goods;
		this.accessoriesType = accessoriesType;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public AccessoriesTypeVO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypeVO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	public Short getCheckup() {
		return checkup;
	}

	public void setCheckup(Short checkup) {
		this.checkup = checkup;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getBompany() {
		return bompany;
	}

	public void setBompany(String bompany) {
		this.bompany = bompany;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
