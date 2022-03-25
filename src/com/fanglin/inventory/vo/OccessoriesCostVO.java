package com.fanglin.inventory.vo;

import java.io.Serializable;

public class OccessoriesCostVO implements Serializable {

	private static final long serialVersionUID = 6149863865123365606L;

	private Long ocid; // 外辅费用ID

	private Long oid; // 辅料单ID

	private Integer initPrice;

	private Integer price; // 金额

	private Integer cost; // 成本

	private short type; // 类型 , 0: 车运费 , 1: 搬运费 , 2: 上楼费

	private short status;

	public OccessoriesCostVO() {
		super();
	}

	public Long getOcid() {
		return ocid;
	}

	public void setOcid(Long ocid) {
		this.ocid = ocid;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public Integer getInitPrice() {
		return initPrice;
	}

	public void setInitPrice(Integer initPrice) {
		this.initPrice = initPrice;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getCost() {
		return cost;
	}

	public void setCost(Integer cost) {
		this.cost = cost;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
