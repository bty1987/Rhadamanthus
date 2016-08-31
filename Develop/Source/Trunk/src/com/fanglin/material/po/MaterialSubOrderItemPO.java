package com.fanglin.material.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialsuborderitem", catalog = "platform")
public class MaterialSubOrderItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 2310778692937056830L;
	
	public static final String COLUMN_MSOIID_STR = "msoiId";
	
	public static final String COLUMN_MSOID_STR = "msoId";
	
	public static final String COLUMN_MATERIALMODELNO_STR = "materialModelNo";
	
	public static final String COLUMN_MATERIALMODELNAME_STR = "materialModelName";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_PAYMENTSTATUS_STR = "paymentStatus";
	
	public static final String COLUMN_REFUNDSTATUS_STR = "refundStatus";
	
	public static final String COLUMN_BALANCESTATUS_STR = "balanceStatus";
	
	public static final String COLUMN_MPID_STR = "mpId";
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_DELETE_INT = 4;
	
	public static final int PAYMENTSTATUS_TYPE_INIT_INT = 0;
	
	public static final int PAYMENTSTATUS_TYPE_PAYMENT_INT = 1;
	
	public static final int PAYMENTSTATUS_TYPE_CONFIRM_INT = 2;
	
	public static final int REFUNDSTATUS_TYPE_INIT_INT = 0;
	
	public static final int REFUNDSTATUS_TYPE_REJECT_INT = 1;
	
	public static final int BALANCESTATUS_TYPE_INIT_INT = 0;
	
	public static final int BALANCESTATUS_TYPE_PREBALANCE_INT = 1;
	
	public static final int BALANCESTATIS_TYPE_POSTBALANCE_INT = 3;
	
	public static final int CALCTYPE_TYPE_BASE_INT = 0;
	
	public static final int CALCTYPE_TYPE_POINT_INT = 1;

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
	
	private int status;
	
	private int balanceStatus;
	
	private int refundStatus;
	
	private int rawCalcType;
	
	private float rawPoint;
	
	private int calcType;
	
	private float prePoint;
	
	private float postPoint;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "msoiId")
	public long getMsoiId(){
		return this.msoiId;
	}

	public void setMsoiId(long msoiId){
		this.msoiId = msoiId;
	}

	@Column(name = "msoId")
	public long getMsoId(){
		return this.msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	@Column(name = "mpId")
	public long getMpId(){
		return mpId;
	}

	public void setMpId(long mpId){
		this.mpId = mpId;
	}

	@Column(name = "materialModelNo")
	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
	}

	@Column(name = "materialModelName")
	public String getMaterialModelName(){
		return this.materialModelName;
	}

	public void setMaterialModelName(String materialModelName){
		this.materialModelName = materialModelName;
	}

	@Column(name = "materialTypeName")
	public String getMaterialTypeName(){
		return this.materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName){
		this.materialTypeName = materialTypeName;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName(){
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName){
		this.materialBrandName = materialBrandName;
	}

	@Column(name = "measurementUnitName")
	public String getMeasurementUnitName(){
		return this.measurementUnitName;
	}

	public void setMeasurementUnitName(
			String measurementUnitName){
		this.measurementUnitName = measurementUnitName;
	}

	@Column(name = "packageName")
	public String getPackageName(){
		return this.packageName;
	}

	public void setPackageName(String packageName){
		this.packageName = packageName;
	}

	@Column(name = "materialUnitPrice")
	public float getMaterialUnitPrice(){
		return this.materialUnitPrice;
	}

	public void setMaterialUnitPrice(float materialUnitPrice){
		this.materialUnitPrice = materialUnitPrice;
	}

	@Column(name = "materialPurchasePrice")
	public float getMaterialPurchasePrice(){
		return this.materialPurchasePrice;
	}

	public void setMaterialPurchasePrice(float materialPurchasePrice){
		this.materialPurchasePrice = materialPurchasePrice;
	}

	@Column(name = "salePrice")
	public float getSalePrice(){
		return this.salePrice;
	}

	public void setSalePrice(float salePrice){
		this.salePrice = salePrice;
	}

	@Column(name = "price")
	public float getPrice(){
		return this.price;
	}

	public void setPrice(float price){
		this.price = price;
	}
	
	@Column(name = "discount")
	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}

	@Column(name = "postDiscount")
	public float getPostDiscount(){
		return this.postDiscount;
	}

	public void setPostDiscount(float postDiscount){
		this.postDiscount = postDiscount;
	}

	@Column(name = "num", nullable = false)
	public float getNum(){
		return this.num;
	}

	public void setNum(float num){
		this.num = num;
	}

	@Column(name = "total")
	public float getTotal(){
		return this.total;
	}

	public void setTotal(float total){
		this.total = total;
	}

	@Column(name = "status", nullable = false)
	public int getStatus(){
		return this.status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "prePoint")
	public float getPrePoint(){
		return this.prePoint;
	}

	public void setPrePoint(float prePoint){
		this.prePoint = prePoint;
	}

	@Column(name = "postPoint")
	public float getPostPoint(){
		return this.postPoint;
	}

	public void setPostPoint(float postPoint){
		this.postPoint = postPoint;
	}

	@Column(name = "des")
	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

	@Column(name = "balanceStatus")
	public int getBalanceStatus(){
		return balanceStatus;
	}

	public void setBalanceStatus(int balanceStatus){
		this.balanceStatus = balanceStatus;
	}

	@Column(name = "refundStatus")
	public int getRefundStatus(){
		return refundStatus;
	}

	public void setRefundStatus(int refundStatus){
		this.refundStatus = refundStatus;
	}

	@Column(name = "calcType")
	public int getCalcType(){
		return calcType;
	}

	public void setCalcType(int calcType){
		this.calcType = calcType;
	}

	@Column(name = "rawCalcType")
	public int getRawCalcType() {
		return rawCalcType;
	}

	public void setRawCalcType(int rawCalcType) {
		this.rawCalcType = rawCalcType;
	}

	@Column(name = "rawPoint")
	public float getRawPoint() {
		return rawPoint;
	}

	public void setRawPoint(float rawPoint) {
		this.rawPoint = rawPoint;
	}

}