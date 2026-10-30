package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AccessoriesChargeVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long acid;

	private AccessoriesVO accessories;

	private AccessoriesItemVO accessoriesItem;

	private String name;

	private Long price; // 单价（厘，×1000）

	private Long surplus; // 浮动额（厘，×1000）

	private Integer num;

	public AccessoriesChargeVO() {
		super();
	}

	public AccessoriesChargeVO(AccessoriesVO accessories, AccessoriesItemVO accessoriesItem) {
		super();
		this.accessories = accessories;
		this.accessoriesItem = accessoriesItem;
	}

	public Long getAcid() {
		return acid;
	}

	public void setAcid(Long acid) {
		this.acid = acid;
	}

	public AccessoriesVO getAccessories() {
		return accessories;
	}

	public void setAccessories(AccessoriesVO accessories) {
		this.accessories = accessories;
	}

	public AccessoriesItemVO getAccessoriesItem() {
		return accessoriesItem;
	}

	public void setAccessoriesItem(AccessoriesItemVO accessoriesItem) {
		this.accessoriesItem = accessoriesItem;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public Long getSurplus() {
		return surplus;
	}

	public void setSurplus(Long surplus) {
		this.surplus = surplus;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}
