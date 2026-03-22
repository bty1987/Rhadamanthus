package com.fanglin.data.material.vo;

import java.io.Serializable;

public class AoodsChargeVO implements Serializable {

	private static final long serialVersionUID = 2478633477987763720L;

	private Long acid; // 主键ID

	private AoodsVO aoods; // 关联的辅材

	private String name; // 费用名称

	private Integer price; // 价格（分）

	private Integer surplus; // 浮动额（分）

	private Short type; // 类型：0-通用，1-超阶

	private Short status; // 状态：0-启用，1-禁用

	private Integer sort; // 排序

	public AoodsChargeVO() {
		super();
	}

	public AoodsChargeVO(AoodsVO aoods) {
		super();
		this.aoods = aoods;
	}

	public Long getAcid() {
		return acid;
	}

	public void setAcid(Long acid) {
		this.acid = acid;
	}

	public AoodsVO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsVO aoods) {
		this.aoods = aoods;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

}
