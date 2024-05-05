package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class PresignItemVO implements Serializable {

	private static final long serialVersionUID = -3661397706368912448L;

	private Long piid;

	private Long ppid;

	private PresignProduceVO presignProduce;

	private String name;

	private Integer basicNum;

	private Long cost;

	private Long price;

	private Integer addPrice;

	private Integer subPrice;

	private Integer achePrice;

	private Short areaCale;

	private Short type;

	private Short onetype;

	private Short atttype;

	private Short status;

	private String content;

	public PresignItemVO() {
		super();
	}

	public PresignItemVO(PresignProduceVO presignProduce) {
		super();
		this.presignProduce = presignProduce;
	}

	public Long getPiid() {
		return piid;
	}

	public void setPiid(Long piid) {
		this.piid = piid;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public PresignProduceVO getPresignProduce() {
		return presignProduce;
	}

	public void setPresignProduce(PresignProduceVO presignProduce) {
		this.presignProduce = presignProduce;
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

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
	}

	public Integer getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Integer subPrice) {
		this.subPrice = subPrice;
	}

	public Integer getAchePrice() {
		return achePrice;
	}

	public void setAchePrice(Integer achePrice) {
		this.achePrice = achePrice;
	}

	public Short getAreaCale() {
		return areaCale;
	}

	public void setAreaCale(Short areaCale) {
		this.areaCale = areaCale;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
