package com.fanglin.material.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialsuborder", catalog = "material")
public class MaterialSubOrderPO implements java.io.Serializable {

	private static final long serialVersionUID = 5594088406016802710L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_MSOID_STR = "msoId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_MSONO_STR = "msoNo";
	
	public static final String COLUMN_ORDERADDR_STR = "orderAddr";
	
	public static final String COLUMN_DESIGNERID_STR = "designerId";
	
	public static final String COLUMN_DESIGNERNAME_STR = "designerName";
	
	public static final String COLUMN_SALESMANID_STR = "salesmanId";
	
	public static final String COLUMN_SALESMANNAME_STR = "salesmanName";
	
	public static final String COLUMN_DESIGNERFLAG_STR = "designerFlag";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_BALANCESTATUS_STR = "balanceStatus";
	
	public static final String COLUMN_FULLSTATUS_STR = "fullStatus";
	
	public static final String COLUMN_MATERIALDEPTID_STR = "materialDeptId";
	
	public static final String COLUMN_INSTOREID_STR = "instoreId";
	
	public static final String COLUMN_FULLCOLLECTTIME_STR = "fullCollectTime";
	
	public static final String COLUMN_FULLCOLLECTTIME_RANGE_STR = "fullCollectTimeRange";
	//静态加载品牌名称
	public static final String COLUMN_MATERIALBRAND_STR="materialBrand";
	
	//增加预结算时间
	public static final String COLUMN_PREBALANCETIME_STR="preBalanceTime";
	public static final String COLUMN_PREBALANCETIME_RANGE_STR="preBalanceTimeRange";
	//增加结算时间
	public static final String COLUMN_POSTBALANCETIME_RANGE_STR="postBalanceTimeRange";
	public static final String COLUMN_POSTBALANCETIME_STR="postBalanceTime";
	//增加厂商结算时间
	public static final String COLUMN_VBALANCETIME_RANGE_STR="vbalanceTimeRange";
	public static final String COLUMN_VBALANCETIME_STR="vbBalanceTime";
	//增加归属大区名
	public static final String COLUMN_REGIONNAME_STR="regionName";
	//增加归属部门名
	public static final String COLUMN_DEPARTMENTNAME_STR="departmentName";
	
	
	public static final int MSO_TYPE_GIVE_INT = 4;
	
	public static final int MSO_TYPE_INSIDE_INT = 5;
	
	public static final int STATUS_TYPE_INIT_INT = 0;//初始
	
	public static final int STATUS_TYPE_DELETE_INT = 1;//删除
	
	public static final int STATUS_TYPE_REFUND_INT = 2;//退货
	
	public static final int STATUS_TYPE_PREBALANCE_INT = 3;//预结算
	
	public static final int STATUS_TYPE_ARRIVAL_INT = 4;//？购货
	
	public static final int STATUS_TYPE_POSTBALANCE_INT = 5;//结算
	
	public static final int STATUS_TYPE_FULLREFUND_INT = 6;//全退（退货的一种）
	
	public static final int STATUS_TYPE_DAODAN_INT = 7;//倒单（退货的一部分）
	
	public static final int STATUS_TYPE_WASTE_INT = 8;//作废
	
	public static final int STATUS_TYPE_FINISH_INT = 9;//完结（订单的状态）
	
	public static final int FINANCE_STATUS_TYPE_INIT_INT = 0;//初始（交款状态）
	
	public static final int FINANCE_STATUS_TYPE_COMMIT_INT = 1;//提交
	
	public static final int FINANCE_STATUS_TYPE_COLLECT_INT = 2;//?
	
	public static final int FINANCE_STATUS_TYPE_CONFIRM_INT = 3;//确认
	
	public static final int FINANCE_STATUS_TYPE_APPROVAL_INT = 4;
	
	public static final int BALANCE_STATUS_TYPE_INIT_INT = 0;//初始（结算状态）
	
	public static final int BALANCE_STATUS_TYPE_PRE_INT = 1;//预结算
	
	public static final int BALANCE_STATUS_TYPE_POST_INT = 2;//结算
	
	public static final int DELIVERY_STATUS_TYPE_INIT_INT = 0;//未送货(送货状态)
	
	public static final int DELIVERY_STATUS_TYPE_DELIVE_INT = 1;//已送货
	
	public static final int DESIGNERFLAG_TYPE_OTHER_INT = 0;
	
	public static final int DESIGNERFLAG_TYPE_DESIGNER_INT = 1;
	
	public static final int DESIGNERFLAG_TYPE_SALESMAN_INT = 2;
	
	public static final int OTHER_STATUS_FULL_PAYMENT_INT = 1;
	
	public static final int OTHER_STATUS_MEND_INT = 2;//修理
	
	private long msoId;
	
	private String msoNo;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String salesmanId;
	
	private String salesmanName;
	
	private String materialerId;
	
	private String materialerName;
	
	private String instoreId;
	
	private String instoreName;
	
	private int designerFlag;
	
	private int packageFlag;
	
	private String materialType;
	
	private String materialBrand;
	
	private String regionId;
	
	private String regionName;
	
	private String departmentId;
	
	private String departmentName;
	
	private String materialDeptId;
	
	private String materialDeptName;
	
	private Timestamp createTime;
	
	private Timestamp preBalanceTime;
	
	private Timestamp postBalanceTime;
	
	private int msoType;
	
	private int status;
	
	private float depositPayment;
	
	private int depositStatus;
	
	private float fullPayment;
	
	private int fullStatus;
	
	private Timestamp fullCollectTime;
	
	private int deliveryStatus;
	
	private Timestamp deliveryTime;
	
	private String deliveryUserId;
	
	private int balanceStatus;
	
	private int otherStatus;
	
	private float base;
	
	private float point;
	
	private float total;
	
	private float distotal;
	
	private float maling;
	
	private float venderMaling;
	
	private float coupon;
	
	private String couponInfo;
	
	private float profit;
	
	private float postProfit;
	
	private float custProfit;
	
	private int company;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "msoId")
	public long getMsoId(){
		return this.msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "msoNo")
	public String getMsoNo(){
		return this.msoNo;
	}

	public void setMsoNo(String msoNo){
		this.msoNo = msoNo;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr(){
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	@Column(name = "salesmanName")
	public String getSalesmanName(){
		return this.salesmanName;
	}

	public void setSalesmanName(String salesmanName){
		this.salesmanName = salesmanName;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@Column(name = "preBalanceTime")
	public Timestamp getPreBalanceTime(){
		return this.preBalanceTime;
	}

	public void setPreBalanceTime(Timestamp preBalanceTime){
		this.preBalanceTime = preBalanceTime;
	}

	@Column(name = "postBalanceTime")
	public Timestamp getPostBalanceTime(){
		return this.postBalanceTime;
	}

	public void setPostBalanceTime(Timestamp postBalanceTime){
		this.postBalanceTime = postBalanceTime;
	}

	@Column(name = "msoType")
	public int getMsoType(){
		return this.msoType;
	}

	public void setMsoType(int msoType){
		this.msoType = msoType;
	}

	@Column(name = "status")
	public int getStatus(){
		return this.status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "deliveryStatus")
	public int getDeliveryStatus(){
		return this.deliveryStatus;
	}

	public void setDeliveryStatus(int deliveryStatus){
		this.deliveryStatus = deliveryStatus;
	}

	@Column(name = "total")
	public float getTotal(){
		return this.total;
	}

	public void setTotal(float total){
		this.total = total;
	}
	

	@Column(name = "des")
	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

	@Column(name = "salesmanId")
	public String getSalesmanId(){
		return salesmanId;
	}

	public void setSalesmanId(String salesmanId){
		this.salesmanId = salesmanId;
	}

	@Column(name = "regionId")
	public String getRegionId(){
		return regionId;
	}

	public void setRegionId(String regionId){
		this.regionId = regionId;
	}

	@Column(name = "departmentId")
	public String getDepartmentId(){
		return departmentId;
	}

	public void setDepartmentId(String departmentId){
		this.departmentId = departmentId;
	}

	@Column(name = "materialDeptId")
	public String getMaterialDeptId(){
		return materialDeptId;
	}

	public void setMaterialDeptId(String materialDeptId){
		this.materialDeptId = materialDeptId;
	}

	@Column(name = "depositPayment")
	public float getDepositPayment(){
		return depositPayment;
	}
	
	public void setDepositPayment(float depositPayment){
		this.depositPayment = depositPayment;
	}

	@Column(name = "depositStatus")
	public int getDepositStatus(){
		return depositStatus;
	}

	public void setDepositStatus(int depositStatus){
		this.depositStatus = depositStatus;
	}

	@Column(name = "fullPayment")
	public float getFullPayment(){
		return fullPayment;
	}

	public void setFullPayment(float fullPayment){
		this.fullPayment = fullPayment;
	}

	@Column(name = "fullStatus")
	public int getFullStatus(){
		return fullStatus;
	}

	public void setFullStatus(int fullStatus){
		this.fullStatus = fullStatus;
	}

	@Column(name = "customerName")
	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name = "customerId")
	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	@Column(name = "balanceStatus")
	public int getBalanceStatus(){
		return balanceStatus;
	}

	public void setBalanceStatus(int balanceStatus){
		this.balanceStatus = balanceStatus;
	}

	@Column(name = "point")
	public float getPoint(){
		return point;
	}

	public void setPoint(float point){
		this.point = point;
	}

	@Column(name = "base")
	public float getBase(){
		return base;
	}

	public void setBase(float base){
		this.base = base;
	}

	@Column(name = "designerFlag")
	public int getDesignerFlag(){
		return designerFlag;
	}

	public void setDesignerFlag(int designerFlag){
		this.designerFlag = designerFlag;
	}

	@Column(name = "materialerId")
	public String getMaterialerId(){
		return materialerId;
	}

	public void setMaterialerId(String materialerId){
		this.materialerId = materialerId;
	}

	@Column(name = "materialerName")
	public String getMaterialerName(){
		return materialerName;
	}

	public void setMaterialerName(String materialerName){
		this.materialerName = materialerName;
	}

	@Column(name = "regionName")
	public String getRegionName(){
		return regionName;
	}

	public void setRegionName(String regionName){
		this.regionName = regionName;
	}

	@Column(name = "departmentName")
	public String getDepartmentName(){
		return departmentName;
	}

	public void setDepartmentName(String departmentName){
		this.departmentName = departmentName;
	}

	@Column(name = "materialDeptName")
	public String getMaterialDeptName(){
		return materialDeptName;
	}

	public void setMaterialDeptName(String materialDeptName){
		this.materialDeptName = materialDeptName;
	}

	@Column(name = "packageFlag")
	public int getPackageFlag(){
		return packageFlag;
	}

	public void setPackageFlag(int packageFlag){
		this.packageFlag = packageFlag;
	}

	@Column(name = "maling")
	public float getMaling(){
		return maling;
	}

	public void setMaling(float maling){
		this.maling = maling;
	}

	@Column(name = "venderMaling")
	public float getVenderMaling(){
		return venderMaling;
	}

	public void setVenderMaling(float venderMaling){
		this.venderMaling = venderMaling;
	}

	@Column(name="instoreId")
	public String getInstoreId(){
		return instoreId;
	}

	public void setInstoreId(String instoreId){
		this.instoreId = instoreId;
	}

	@Column(name = "instoreName")
	public String getInstoreName(){
		return instoreName;
	}

	public void setInstoreName(String instoreName){
		this.instoreName = instoreName;
	}

	@Column(name = "coupon")
	public float getCoupon(){
		return coupon;
	}

	public void setCoupon(float coupon){
		this.coupon = coupon;
	}

	@Column(name = "couponInfo")
	public String getCouponInfo(){
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo){
		this.couponInfo = couponInfo;
	}

	@Column(name = "materialType")
	public String getMaterialType(){
		return materialType;
	}

	public void setMaterialType(String materialType){
		this.materialType = materialType;
	}

	@Column(name = "materialBrand")
	public String getMaterialBrand(){
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand){
		this.materialBrand = materialBrand;
	}

	@Column(name = "profit")
	public float getProfit(){
		return profit;
	}

	public void setProfit(float profit){
		this.profit = profit;
	}

	@Column(name = "fullCollectTime")
	public Timestamp getFullCollectTime() {
		return fullCollectTime;
	}

	public void setFullCollectTime(Timestamp fullCollectTime) {
		this.fullCollectTime = fullCollectTime;
	}

	@Column(name = "deliveryTime")
	public Timestamp getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(Timestamp deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	@Column(name = "deliveryUserId")
	public String getDeliveryUserId() {
		return deliveryUserId;
	}

	public void setDeliveryUserId(String deliveryUserId) {
		this.deliveryUserId = deliveryUserId;
	}

	@Column(name = "postProfit")
	public float getPostProfit() {
		return postProfit;
	}

	public void setPostProfit(float postProfit) {
		this.postProfit = postProfit;
	}

	@Column(name = "otherStatus")
	public int getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(int otherStatus) {
		this.otherStatus = otherStatus;
	}
	
	@Column(name = "custProfit")
	public float getCustProfit() {
		return custProfit;
	}

	public void setCustProfit(float custProfit) {
		this.custProfit = custProfit;
	}
	
	@Column(name = "distotal")
	public float getDistotal() {
		return distotal;
	}

	public void setDistotal(float distotal) {
		this.distotal = distotal;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
	

}
