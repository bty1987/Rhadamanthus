/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			:
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;

public class ProtationItemVO implements Serializable {

	private static final long serialVersionUID = -146472244426652327L;

	private Long piid;

	private Long pid;

	private String name;

	private Integer basicNum;

	private Long cost;

	private Long price;

	private Integer num;

	private Short type;

	public Long getPiid() {
		return piid;
	}

	public void setPiid(Long piid) {
		this.piid = piid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getBasicNum() {
		return basicNum;
	}

	public void setBasicNum(Integer basicNum) {
		this.basicNum = basicNum;
	}

	public Long getCost() {
		return cost;
	}

	public void setCost(Long cost) {
		this.cost = cost;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
