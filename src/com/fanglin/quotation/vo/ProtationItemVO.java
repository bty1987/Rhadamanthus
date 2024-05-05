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

	private Long ppiid;

	private String name;

	private Integer basicNum;

	private Long cost;

	private Long price;

	private Long addPrice;

	private Long subPrice;

	private Long achePrice;

	private Integer num;

	private Short type;

	private Short onetype;

	private Short atttype;

	private Short areaCale;

	private String content;

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

	public Long getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Long addPrice) {
		this.addPrice = addPrice;
	}

	public Long getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Long subPrice) {
		this.subPrice = subPrice;
	}

	public Long getAchePrice() {
		return achePrice;
	}

	public void setAchePrice(Long achePrice) {
		this.achePrice = achePrice;
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

	public Short getOnetype() {
		return onetype;
	}

	public void setOnetype(Short onetype) {
		this.onetype = onetype;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getAreaCale() {
		return areaCale;
	}

	public void setAreaCale(Short areaCale) {
		this.areaCale = areaCale;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getPpiid() {
		return ppiid;
	}

	public void setPpiid(Long ppiid) {
		this.ppiid = ppiid;
	}

}
