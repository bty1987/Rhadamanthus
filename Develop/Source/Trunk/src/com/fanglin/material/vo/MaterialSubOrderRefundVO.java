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
	
	private long msorId;
	
	private long msoId;
	
	private long msoiId;
	
	private long mpId;
	
	private int ident;
	
	private String materialModelNo;
	
	private String materialModelName;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private String measurementUnitName;
	
	private String packageName;
	
	private float materialUnitPrice;
	
	private float materialPurchasePrice;
	
	private float salePrice;
	
	private float price;
	
	private float discount;
	
	private float postDiscount;
	
	private float num;
	
	private float total;
	
	private int status;
	
	private int balanceType;
	
	private int id;
	
	private int level;
	
	private boolean isLeaf;
	
	private int parent;
	
	private boolean expanded;
	
	private String des;
	
	private String refundDes;
	
	public long getMsorId(){
		return msorId;
	}

	public void setMsorId(long msorId){
		this.msorId = msorId;
	}

	public long getMsoId(){
		return msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	public long getMsoiId(){
		return msoiId;
	}

	public void setMsoiId(long msoiId){
		this.msoiId = msoiId;
	}

	public long getMpId(){
		return mpId;
	}

	public void setMpId(long mpId){
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

	public float getMaterialUnitPrice(){
		return materialUnitPrice;
	}

	public void setMaterialUnitPrice(float materialUnitPrice){
		this.materialUnitPrice = materialUnitPrice;
	}

	public float getMaterialPurchasePrice(){
		return materialPurchasePrice;
	}

	public void setMaterialPurchasePrice(float materialPurchasePrice){
		this.materialPurchasePrice = materialPurchasePrice;
	}

	public float getSalePrice(){
		return salePrice;
	}

	public void setSalePrice(float salePrice){
		this.salePrice = salePrice;
	}

	public float getPrice(){
		return price;
	}

	public void setPrice(float price){
		this.price = price;
	}

	public float getPostDiscount(){
		return postDiscount;
	}

	public void setPostDiscount(float postDiscount){
		this.postDiscount = postDiscount;
	}

	public float getNum(){
		return num;
	}

	public void setNum(float num){
		this.num = num;
	}

	public float getTotal(){
		return total;
	}

	public void setTotal(float total){
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

	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}

	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public int getLevel(){
		return level;
	}

	public void setLevel(int level){
		this.level = level;
	}

	public boolean getIsLeaf(){
		return isLeaf;
	}

	public void setIsLeaf(boolean isLeaf){
		this.isLeaf = isLeaf;
	}

	public int getParent(){
		return parent;
	}

	public void setParent(int parent){
		this.parent = parent;
	}

	public boolean isExpanded(){
		return expanded;
	}

	public void setExpanded(boolean expanded){
		this.expanded = expanded;
	}

	public int getIdent(){
		return ident;
	}

	public void setIdent(int ident){
		this.ident = ident;
	}

	public int getBalanceType(){
		return balanceType;
	}

	public void setBalanceType(int balanceType){
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
	
}
