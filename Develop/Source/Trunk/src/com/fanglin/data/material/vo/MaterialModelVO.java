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

public class MaterialModelVO implements Serializable{

	private static final long serialVersionUID = -5221234193724730179L;
	
	private int mmId;
	
	private String materialModelNo;
	
	private String materialModelName;
	
	private long materialTypeId;
	
	private String materialTypeName;
	
	private long materialBrandId;
	
	private String materialBrandName;
	
	private int measurementUnitId;
	
	private String measurementUnitName;
	
	private float materialUnitPrice;
	
	private float materialPurchasePrice;
	
	private float discount;
	
	private int calcType;
	
	private float point;
	
	private float base;
	
	private String calcTypeName;
	
	private float calcValue;
	
	private short status;

	public int getMmId(){
		return mmId;
	}

	public void setMmId(int mmId){
		this.mmId = mmId;
	}
	
	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
	}

	public String getMaterialModelName(){
		return materialModelName;
	}

	public void setMaterialModelName(String materialModelName){
		this.materialModelName = materialModelName;
	}

	public float getMaterialUnitPrice(){
		return materialUnitPrice;
	}

	public void setMaterialUnitPrice(float materialUnitPrice){
		this.materialUnitPrice = materialUnitPrice;
	}

	public long getMaterialBrandId(){
		return materialBrandId;
	}

	public void setMaterialBrandId(long materialBrandId){
		this.materialBrandId = materialBrandId;
	}

	public String getMaterialBrandName(){
		return materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName){
		this.materialBrandName = materialBrandName;
	}

	public int getMeasurementUnitId(){
		return measurementUnitId;
	}

	public void setMeasurementUnitId(int measurementUnitId){
		this.measurementUnitId = measurementUnitId;
	}

	public String getMeasurementUnitName(){
		return measurementUnitName;
	}

	public void setMeasurementUnitName(String measurementUnitName){
		this.measurementUnitName = measurementUnitName;
	}

	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}

	public float getBase(){
		return base;
	}

	public void setBase(float base){
		this.base = base;
	}

	public long getMaterialTypeId(){
		return materialTypeId;
	}

	public void setMaterialTypeId(long materialTypeId){
		this.materialTypeId = materialTypeId;
	}
	
	public int getCalcType(){
		return calcType;
	}

	public void setCalcType(int calcType){
		this.calcType = calcType;
	}

	public String getMaterialTypeName(){
		return materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName){
		this.materialTypeName = materialTypeName;
	}

	public float getPoint(){
		return point;
	}

	public void setPoint(float point){
		this.point = point;
	}

	public float getMaterialPurchasePrice(){
		return materialPurchasePrice;
	}

	public void setMaterialPurchasePrice(float materialPurchasePrice){
		this.materialPurchasePrice = materialPurchasePrice;
	}

	public String getCalcTypeName(){
		return calcTypeName;
	}

	public void setCalcTypeName(String calcTypeName){
		this.calcTypeName = calcTypeName;
	}

	public float getCalcValue(){
		return calcValue;
	}

	public void setCalcValue(float calcValue){
		this.calcValue = calcValue;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
