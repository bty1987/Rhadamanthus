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

public class MaterialSubOrderItemVO implements Serializable{

	private static final long serialVersionUID = -8098978785825170596L;
	
	private Long msoiId;
	
	private Long msoId;
	
	private String materialModelNo;
	
	private String materialModelName;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private String measurementUnitName;
	
	private String packageName;
	
	private Float materialUnitPrice;
	
	private Float materialPurchasePrice;
	
	private Float salePrice;
	
	private Float price;
	
	private Float discount;
	
	private Float postDiscount;
	
	private Float num;
	
	private Float total;
	
	private Integer status; // 无 , 退货 , 预结算 , 结算 , 删除
	
	private Integer balanceStatus;
	
	private Integer refundStatus;
	
	private Integer rawCalcType;
	
	private Float rawPoint;
	
	private Integer calcType;
	
	private Float prePoint;
	
	private Float postPoint;
	
	private Float base;
	
	private Float point;
	
	private String des;
	
	private Integer id;
	
	private Integer level;
	
	private boolean isLeaf;
	
	private Integer parent;
	
	private boolean expanded;

	public Long getMsoiId(){
		return msoiId;
	}

	public void setMsoiId(Long msoiId){
		this.msoiId = msoiId;
	}

	public Long getMsoId(){
		return msoId;
	}

	public void setMsoId(Long msoId){
		this.msoId = msoId;
	}

	public String getMaterialModelName(){
		return materialModelName;
	}

	public void setMaterialModelName(String materialModelName){
		this.materialModelName = materialModelName;
	}

	public String getMaterialTypeName(){
		return materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName){
		this.materialTypeName = materialTypeName;
	}

	public String getMaterialBrandName(){
		return materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName){
		this.materialBrandName = materialBrandName;
	}

	public String getMeasurementUnitName(){
		return measurementUnitName;
	}

	public void setMeasurementUnitName(String measurementUnitName){
		this.measurementUnitName = measurementUnitName;
	}

	public String getPackageName(){
		return packageName;
	}

	public void setPackageName(String packageName){
		this.packageName = packageName;
	}

	public Float getMaterialUnitPrice(){
		return materialUnitPrice;
	}

	public void setMaterialUnitPrice(Float materialUnitPrice){
		this.materialUnitPrice = materialUnitPrice;
	}

	public Float getMaterialPurchasePrice(){
		return materialPurchasePrice;
	}

	public void setMaterialPurchasePrice(Float materialPurchasePrice){
		this.materialPurchasePrice = materialPurchasePrice;
	}

	public Float getSalePrice(){
		return salePrice;
	}

	public void setSalePrice(Float salePrice){
		this.salePrice = salePrice;
	}

	public Float getPrice(){
		return price;
	}

	public void setPrice(Float price){
		this.price = price;
	}

	public Float getPostDiscount(){
		return postDiscount;
	}

	public void setPostDiscount(Float postDiscount){
		this.postDiscount = postDiscount;
	}

	public Float getNum(){
		return num;
	}

	public void setNum(Float num){
		this.num = num;
	}

	public Float getTotal(){
		return total;
	}

	public void setTotal(Float total){
		this.total = total;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public Float getPrePoint(){
		return prePoint;
	}

	public void setPrePoint(Float prePoint){
		this.prePoint = prePoint;
	}

	public Float getPostPoint(){
		return postPoint;
	}

	public void setPostPoint(Float postPoint){
		this.postPoint = postPoint;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public Float getDiscount(){
		return discount;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
	}

	public Integer getId(){
		return id;
	}

	public void setId(Integer id){
		this.id = id;
	}

	public Integer getLevel(){
		return level;
	}

	public void setLevel(Integer level){
		this.level = level;
	}

	public boolean getIsLeaf(){
		return isLeaf;
	}

	public void setIsLeaf(boolean isLeaf){
		this.isLeaf = isLeaf;
	}

	public Integer getParent(){
		return parent;
	}

	public void setParent(Integer parent){
		this.parent = parent;
	}

	public boolean isExpanded(){
		return expanded;
	}

	public void setExpanded(boolean expanded){
		this.expanded = expanded;
	}

	public Integer getBalanceStatus(){
		return balanceStatus;
	}

	public void setBalanceStatus(Integer balanceStatus){
		this.balanceStatus = balanceStatus;
	}

	public Integer getRefundStatus(){
		return refundStatus;
	}

	public void setRefundStatus(Integer refundStatus){
		this.refundStatus = refundStatus;
	}

	public Integer getCalcType(){
		return calcType;
	}

	public void setCalcType(Integer calcType){
		this.calcType = calcType;
	}

	public Integer getRawCalcType() {
		return rawCalcType;
	}

	public void setRawCalcType(Integer rawCalcType) {
		this.rawCalcType = rawCalcType;
	}

	public Float getRawPoint() {
		return rawPoint;
	}

	public void setRawPoint(Float rawPoint) {
		this.rawPoint = rawPoint;
	}

	public Float getBase() {
		return base;
	}

	public void setBase(Float base) {
		this.base = base;
	}

	public Float getPoint() {
		return point;
	}

	public void setPoint(Float point) {
		this.point = point;
	}
	
}
