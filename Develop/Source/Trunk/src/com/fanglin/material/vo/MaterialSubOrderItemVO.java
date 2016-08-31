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
	
	private long msoiId;
	
	private long msoId;
	
	private long mpId;
	
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
	
	private int status; // 无 , 退货 , 预结算 , 结算 , 删除
	
	private int balanceStatus;
	
	private int refundStatus;
	
	private int rawCalcType;
	
	private float rawPoint;
	
	private int calcType;
	
	private float prePoint;
	
	private float postPoint;
	
	private float base;
	
	private float point;
	
	private String des;
	
	private int id;
	
	private int level;
	
	private boolean isLeaf;
	
	private int parent;
	
	private boolean expanded;

	public long getMsoiId(){
		return msoiId;
	}

	public void setMsoiId(long msoiId){
		this.msoiId = msoiId;
	}

	public long getMsoId(){
		return msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
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

	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	public float getPrePoint(){
		return prePoint;
	}

	public void setPrePoint(float prePoint){
		this.prePoint = prePoint;
	}

	public float getPostPoint(){
		return postPoint;
	}

	public void setPostPoint(float postPoint){
		this.postPoint = postPoint;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}

	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
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

	public int getBalanceStatus(){
		return balanceStatus;
	}

	public void setBalanceStatus(int balanceStatus){
		this.balanceStatus = balanceStatus;
	}

	public int getRefundStatus(){
		return refundStatus;
	}

	public void setRefundStatus(int refundStatus){
		this.refundStatus = refundStatus;
	}

	public int getCalcType(){
		return calcType;
	}

	public void setCalcType(int calcType){
		this.calcType = calcType;
	}

	public int getRawCalcType() {
		return rawCalcType;
	}

	public void setRawCalcType(int rawCalcType) {
		this.rawCalcType = rawCalcType;
	}

	public float getRawPoint() {
		return rawPoint;
	}

	public void setRawPoint(float rawPoint) {
		this.rawPoint = rawPoint;
	}

	public float getBase() {
		return base;
	}

	public void setBase(float base) {
		this.base = base;
	}

	public float getPoint() {
		return point;
	}

	public void setPoint(float point) {
		this.point = point;
	}
	
}
