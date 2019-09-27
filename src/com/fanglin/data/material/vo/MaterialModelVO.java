/**
 * @File Name		: MaterialModel.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.vo;

import java.io.Serializable;

public class MaterialModelVO implements Serializable {

	private static final long serialVersionUID = -5221234193724730179L;

	private Integer mmId;

	private String materialModelNo;

	private String materialModelName;

	private Long materialTypeId;

	private String materialTypeName;

	private Long materialBrandId;

	private String materialBrandName;

	private Integer measurementUnitId;

	private String measurementUnitName;

	private Integer materialUnitPrice;

	private Integer materialPurchasePrice;

	private Integer discount;

	private Integer calcType;

	private Integer point;

	private Integer base;

	private String calcTypeName;

	private Integer calcValue;

	private Short status;

	private Integer company;

	public Integer getMmId() {
		return mmId;
	}

	public void setMmId(Integer mmId) {
		this.mmId = mmId;
	}

	public String getMaterialModelNo() {
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo) {
		this.materialModelNo = materialModelNo;
	}

	public String getMaterialModelName() {
		return materialModelName;
	}

	public void setMaterialModelName(String materialModelName) {
		this.materialModelName = materialModelName;
	}

	public Long getMaterialTypeId() {
		return materialTypeId;
	}

	public void setMaterialTypeId(Long materialTypeId) {
		this.materialTypeId = materialTypeId;
	}

	public String getMaterialTypeName() {
		return materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName) {
		this.materialTypeName = materialTypeName;
	}

	public Long getMaterialBrandId() {
		return materialBrandId;
	}

	public void setMaterialBrandId(Long materialBrandId) {
		this.materialBrandId = materialBrandId;
	}

	public String getMaterialBrandName() {
		return materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	public Integer getMeasurementUnitId() {
		return measurementUnitId;
	}

	public void setMeasurementUnitId(Integer measurementUnitId) {
		this.measurementUnitId = measurementUnitId;
	}

	public String getMeasurementUnitName() {
		return measurementUnitName;
	}

	public void setMeasurementUnitName(String measurementUnitName) {
		this.measurementUnitName = measurementUnitName;
	}

	public Integer getMaterialUnitPrice() {
		return materialUnitPrice;
	}

	public void setMaterialUnitPrice(Integer materialUnitPrice) {
		this.materialUnitPrice = materialUnitPrice;
	}

	public Integer getMaterialPurchasePrice() {
		return materialPurchasePrice;
	}

	public void setMaterialPurchasePrice(Integer materialPurchasePrice) {
		this.materialPurchasePrice = materialPurchasePrice;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getCalcType() {
		return calcType;
	}

	public void setCalcType(Integer calcType) {
		this.calcType = calcType;
	}

	public Integer getPoint() {
		return point;
	}

	public void setPoint(Integer point) {
		this.point = point;
	}

	public Integer getBase() {
		return base;
	}

	public void setBase(Integer base) {
		this.base = base;
	}

	public String getCalcTypeName() {
		return calcTypeName;
	}

	public void setCalcTypeName(String calcTypeName) {
		this.calcTypeName = calcTypeName;
	}

	public Integer getCalcValue() {
		return calcValue;
	}

	public void setCalcValue(Integer calcValue) {
		this.calcValue = calcValue;
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

}
