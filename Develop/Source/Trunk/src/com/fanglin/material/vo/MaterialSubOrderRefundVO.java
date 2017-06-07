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

public class MaterialSubOrderRefundVO implements Serializable {

	private static final long serialVersionUID = 8997198619142688407L;
	
	private Long msorId;
	
	private Long msoId;
	
	private Long msoiId;
	
	private Long mpId;
	
	private Integer ident;
	
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
	
	private Integer status;
	
	private Integer balanceType;
	
	private Integer id;
	
	private Integer level;
	
	private boolean isLeaf;
	
	private Integer parent;
	
	private boolean expanded;
	
	private String des;
	
	private String refundDes;
	
	private Float prePoint;
	
	private Float postPoint;
	
	public Long getMsorId(){
		return msorId;
	}

	public void setMsorId(Long msorId){
		this.msorId = msorId;
	}

	public Long getMsoId(){
		return msoId;
	}

	public void setMsoId(Long msoId){
		this.msoId = msoId;
	}

	public Long getMsoiId(){
		return msoiId;
	}

	public void setMsoiId(Long msoiId){
		this.msoiId = msoiId;
	}

	public Long getMpId(){
		return mpId;
	}

	public void setMpId(Long mpId){
		this.mpId = mpId;
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

	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
	}

	public Float getDiscount(){
		return discount;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
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

	public Integer getIdent(){
		return ident;
	}

	public void setIdent(Integer ident){
		this.ident = ident;
	}

	public Integer getBalanceType(){
		return balanceType;
	}

	public void setBalanceType(Integer balanceType){
		this.balanceType = balanceType;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getRefundDes(){
		return refundDes;
	}

	public void setRefundDes(String refundDes){
		this.refundDes = refundDes;
	}

	public Float getPrePoint() {
		return prePoint;
	}

	public void setPrePoint(Float prePoint) {
		this.prePoint = prePoint;
	}

	public Float getPostPoint() {
		return postPoint;
	}

	public void setPostPoint(Float postPoint) {
		this.postPoint = postPoint;
	}

	public void setLeaf(boolean isLeaf) {
		this.isLeaf = isLeaf;
	}
	
	
}
