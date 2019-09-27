/**
 * @File Name		: MaterialSubOrderItemVO.java
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

public class MaterialItemVO implements Serializable {

	private static final long serialVersionUID = -8098978785825170596L;

	private Long miid;

	private Long mid;

	private String no;

	private String name;

	private String category;

	private String brand;

	private String measurementUnit;

	private String packageName;

	private Integer unitPrice;

	private Integer purchasePrice;

	private Long salePrice;

	private Long price;

	private Integer discount;

	private Integer postDiscount;

	private Long num;

	private Long total;

	private Short status; // 无 , 退货 , 预结算 , 结算 , 删除

	private Short balanceStatus;

	private Short refundStatus;

	private Short rawCalcType;

	private Integer rawPoint;

	private Short calcType;

	private Integer prePoint;

	private Integer postPoint;

	private String comment;

	private boolean isLeaf;

	private boolean expanded;

	private Integer level;

	private Integer parent;

	private Integer id;

	private Integer base;

	private Integer point;

	public Long getMiid() {
		return miid;
	}

	public void setMiid(Long miid) {
		this.miid = miid;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
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

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(Integer purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	public Long getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(Long salePrice) {
		this.salePrice = salePrice;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getPostDiscount() {
		return postDiscount;
	}

	public void setPostDiscount(Integer postDiscount) {
		this.postDiscount = postDiscount;
	}

	public Long getNum() {
		return num;
	}

	public void setNum(Long num) {
		this.num = num;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(Short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	public Short getRefundStatus() {
		return refundStatus;
	}

	public void setRefundStatus(Short refundStatus) {
		this.refundStatus = refundStatus;
	}

	public Short getRawCalcType() {
		return rawCalcType;
	}

	public void setRawCalcType(Short rawCalcType) {
		this.rawCalcType = rawCalcType;
	}

	public Integer getRawPoint() {
		return rawPoint;
	}

	public void setRawPoint(Integer rawPoint) {
		this.rawPoint = rawPoint;
	}

	public Short getCalcType() {
		return calcType;
	}

	public void setCalcType(Short calcType) {
		this.calcType = calcType;
	}

	public Integer getPrePoint() {
		return prePoint;
	}

	public void setPrePoint(Integer prePoint) {
		this.prePoint = prePoint;
	}

	public Integer getPostPoint() {
		return postPoint;
	}

	public void setPostPoint(Integer postPoint) {
		this.postPoint = postPoint;
	}

	public void setLeaf(boolean isLeaf) {
		this.isLeaf = isLeaf;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public boolean getIsLeaf() {
		return isLeaf;
	}

	public void setIsLeaf(boolean isLeaf) {
		this.isLeaf = isLeaf;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public Integer getParent() {
		return parent;
	}

	public void setParent(Integer parent) {
		this.parent = parent;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getBase() {
		return base;
	}

	public void setBase(Integer base) {
		this.base = base;
	}

	public Integer getPoint() {
		return point;
	}

	public void setPoint(Integer point) {
		this.point = point;
	}

}
