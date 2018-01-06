/**
 * @File Name		: MaterialSubOrderRefundVO.java
 * @Package   	: com.fanglin.vo.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.vo;

import java.io.Serializable;

public class MaterialRefundVO implements Serializable {

	private static final long serialVersionUID = 8997198619142688407L;
	
	private Long mrid;
	
	private Long mid;
	
	private Long miid;
	
	private Long mpId;
	
	private Integer ident;
	
	private String no;
	
	private String name;
	
	private String category;
	
	private String brand;
	
	private String measurementUnit;
	
	private String packageName;
	
	private Float unitPrice;
	
	private Float purchasePrice;
	
	private Float salePrice;
	
	private Float price;
	
	private Float discount;
	
	private Float postDiscount;
	
	private Float num;
	
	private Float total;
	
	private Integer status;
	
	private Integer balanceType;
	
	private String comment;
	
	public Long getMrid() {
		return mrid;
	}

	public void setMrid(Long mrid) {
		this.mrid = mrid;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public Long getMiid() {
		return miid;
	}

	public void setMiid(Long miid) {
		this.miid = miid;
	}
	
	public Long getMpId() {
		return mpId;
	}

	public void setMpId(Long mpId) {
		this.mpId = mpId;
	}

	public Integer getIdent() {
		return ident;
	}

	public void setIdent(Integer ident) {
		this.ident = ident;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public Float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Float getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(Float purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	public Float getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(Float salePrice) {
		this.salePrice = salePrice;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
		this.discount = discount;
	}

	public Float getPostDiscount() {
		return postDiscount;
	}

	public void setPostDiscount(Float postDiscount) {
		this.postDiscount = postDiscount;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getBalanceType() {
		return balanceType;
	}

	public void setBalanceType(Integer balanceType) {
		this.balanceType = balanceType;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}