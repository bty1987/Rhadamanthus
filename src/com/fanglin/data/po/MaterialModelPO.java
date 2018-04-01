/**
 * @File Name		: MaterialModalPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.MeasurementUnitPO;

@Entity
@Table(name="materialmodel", catalog = "data")
public class MaterialModelPO implements Serializable {

	private static final long serialVersionUID = 7005034712246904666L;
	
	public static final String COLUMN_MATERIALMODELNAME_STR = "materialModelName";
	
	public static final String COLUMN_MATERIALMODELNO_STR = "materialModelNo";
	
	public static final String COLUMN_MATERIALBRANDID_STR = "brand.bid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final int CALC_TYPE_BASE_INT = 0;
	
	public static final String CALC_TYPE_BASE_STR = "底价";
	
	public static final int CALC_TYPE_POINT_INT = 1;
	
	public static final String CALC_TYPE_POINT_STR = "点位";
	
	public static final short TYPE_ENABLE_INT = 0;
	
	public static final short TYPE_DISABLE_INT = 1;
	
	private int mmId;
	
	private String materialModelNo;
	
	private String materialModelName;
	
	private BrandPO brand;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private MeasurementUnitPO measurementUnit;
	
	private String measurementUnitName;
	
	private float materialUnitPrice;
	
	private float materialPurchasePrice;
	
	private float discount;
	
	private int calcType;
	
	private float point;
	
	private float base;
	
	private short status;
	
	private int company;

	@Id
	@Column(name="mmId")
	public int getMmId(){
		return mmId;
	}

	public void setMmId(int mmId){
		this.mmId = mmId;
	}

	@Column(name="materialModelNo")
	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
	}

	@Column(name="materialModelName")
	public String getMaterialModelName(){
		return materialModelName;
	}

	public void setMaterialModelName(String materialModelName){
		this.materialModelName = materialModelName;
	}

	@Column(name="materialUnitPrice")
	public float getMaterialUnitPrice(){
		return materialUnitPrice;
	}

	public void setMaterialUnitPrice(float materialUnitPrice){
		this.materialUnitPrice = materialUnitPrice;
	}

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(nullable=false, name="brandId",referencedColumnName = "bId")
	public BrandPO getBrand(){
		return brand;
	}

	public void setBrand(BrandPO brand){
		this.brand = brand;
	}

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(nullable=false, name="measurementUnitId",referencedColumnName = "id")
	public MeasurementUnitPO getMeasurementUnit(){
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit){
		this.measurementUnit = measurementUnit;
	}

	public String getMeasurementUnitName(){
		return measurementUnitName;
	}

	public void setMeasurementUnitName(String measurementUnitName){
		this.measurementUnitName = measurementUnitName;
	}
	
	@Column(name="discount")
	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}

	@Column(name="base")
	public float getBase(){
		return base;
	}

	public void setBase(float base){
		this.base = base;
	}

	@Column(name="materialTypeName")
	public String getMaterialTypeName(){
		return materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName){
		this.materialTypeName = materialTypeName;
	}

	@Column(name="materialBrandName")
	public String getMaterialBrandName(){
		return materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName){
		this.materialBrandName = materialBrandName;
	}

	@Column(name="point")
	public float getPoint(){
		return point;
	}

	public void setPoint(float point){
		this.point = point;
	}

	@Column(name="calcType")
	public int getCalcType(){
		return calcType;
	}

	public void setCalcType(int calcType){
		this.calcType = calcType;
	}

	@Column(name="materialPurchasePrice")
	public float getMaterialPurchasePrice(){
		return materialPurchasePrice;
	}

	public void setMaterialPurchasePrice(float materialPurchasePrice){
		this.materialPurchasePrice = materialPurchasePrice;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
	

}