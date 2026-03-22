package com.fanglin.inventory.vo;

import java.io.Serializable;

public class OccessoriesChargeVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long acid;

	private OccessoriesVO occessories;

	private OccessoriesItemVO occessoriesItem;

	private String name;

	private Integer price;

	private Integer surplus;

	private Integer num;

	public Long getAcid() {
		return acid;
	}

	public void setAcid(Long acid) {
		this.acid = acid;
	}

	public OccessoriesVO getOccessories() {
		return occessories;
	}

	public void setOccessories(OccessoriesVO occessories) {
		this.occessories = occessories;
	}

	public OccessoriesItemVO getOccessoriesItem() {
		return occessoriesItem;
	}

	public void setOccessoriesItem(OccessoriesItemVO occessoriesItem) {
		this.occessoriesItem = occessoriesItem;
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

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}
