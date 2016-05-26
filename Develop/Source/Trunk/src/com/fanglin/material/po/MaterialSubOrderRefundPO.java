package com.fanglin.material.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialsuborderrefund", catalog = "platform")
public class MaterialSubOrderRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = 8113424076445112728L;
	
	public static final int STATUS_TYPE_REFUND_INT = 0;
	
	public static final int STATUS_TYPE_CANCEL_INT = 1;
	
	public static final int STATUS_TYPE_PAYMENTCOLLECT_INT = 2;
	
	public static final int STATUS_TYPE_PAYMENTCONFIRM_INT = 3;
	
	public static final String COLUMN_MSOID_STR = "msoId";
	
	public static final String COLUMN_MSOIID_STR = "msoiId";
	
	public static final String COLUMN_MPID_STR = "mpId";
	
	public static final String COLUMN_IDENT_STR = "ident";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	private long msorId;
	
	private long msoId;
	
	private long msoiId;
	
	private int dpbsId;
	
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
	
	private int calcType;
	
	private float prePoint;
	
	private float postPoint;
	
	private String des;
	
	private String refundDes;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "msorId")
	public long getMsorId(){
		return this.msorId;
	}

	public void setMsorId(long msorId){
		this.msorId = msorId;
	}

	@Column(name = "msoId")
	public long getMsoId(){
		return this.msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	@Column(name = "msoiId")
	public long getMsoiId(){
		return msoiId;
	}

	public void setMsoiId(long msoiId){
		this.msoiId = msoiId;
	}
	
	@Column(name = "mpId")
	public long getMpId(){
		return mpId;
	}

	public void setMpId(long mpId){
		this.mpId = mpId;
	}

	@Column(name = "ident")
	public int getIdent(){
		return ident;
	}

	public void setIdent(int ident){
		this.ident = ident;
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
		return measurementUnitName;
	}

	public void setMeasurementUnitName(String measurementUnitName){
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

	@Column(name = "materialModelNo")
	public String getMaterialModelNo(){
		return materialModelNo;
	}

	public void setMaterialModelNo(String materialModelNo){
		this.materialModelNo = materialModelNo;
	}

	@Column(name = "status")
	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "calcType")
	public int getCalcType(){
		return calcType;
	}

	public void setCalcType(int calcType){
		this.calcType = calcType;
	}

	@Column(name = "prePoint")
	public float getPrePoint(){
		return prePoint;
	}

	public void setPrePoint(float prePoint){
		this.prePoint = prePoint;
	}

	@Column(name = "postPoint")
	public float getPostPoint(){
		return postPoint;
	}

	public void setPostPoint(float postPoint){
		this.postPoint = postPoint;
	}

	@Column(name = "balanceType")
	public int getBalanceType(){
		return balanceType;
	}

	public void setBalanceType(int balanceType){
		this.balanceType = balanceType;
	}

	@Column(name = "dpbsId")
	public int getDpbsId(){
		return dpbsId;
	}

	public void setDpbsId(int dpbsId){
		this.dpbsId = dpbsId;
	}

	@Column(name = "des")
	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	@Column(name = "refundDes")
	public String getRefundDes(){
		return refundDes;
	}

	public void setRefundDes(String refundDes){
		this.refundDes = refundDes;
	}

}