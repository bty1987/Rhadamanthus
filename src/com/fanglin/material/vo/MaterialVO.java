/**
 * @File Name		: MaterialSubOrderVO.java
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
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserBaseVO;


public class MaterialVO implements Serializable {

	private static final long serialVersionUID = -5594088406016802739L;
	
	private Long mid;
	
	private String no;
	
	private String orderId;
	
	private HouseVO house;
	
	private CustomerVO customer;
	
	private UserBaseVO salesman;
	
	private UserBaseVO materialer;
	
	private UserBaseVO instorer;
	
	private String category;
	
	private Long bid;
	
	private String brand;
	
	private Short packageFlag;
	
	private DepartmentVO region;
	
	private DepartmentVO department;
	
	private DepartmentVO materialDepartment;
	
	private Timestamp createTime;
	
	private Timestamp preBalanceTime;
	
	private Timestamp postBalanceTime;
	
	private Timestamp fullpayTime;
	
	private Short type;
	
	private Short status;
	
	private Short balanceStatus;
	
	private Short otherStatus;
	
	private Float depositPayment;
	
	private Short depositStatus;
	
	private Float fullPayment;
	
	private Short fullStatus;
	
	private Float total;
	
	private Float distotal;
	
	private Float maling;
	
	private Float venderMaling;
	
	private Float coupon;
	
	private String couponInfo;
	
	private String comment;
	
	private Integer company;
	
	private Long activityId;
	
	private String grade;
	
	public MaterialVO(){
		super();
	}
	
	public MaterialVO(HouseVO house){
		super();
		this.house = house;
	}
	
	public MaterialVO(HouseVO house, CustomerVO customer){
		super();
		this.house = house;
		this.customer = customer;
	}

	public MaterialVO(HouseVO house, CustomerVO customer, UserBaseVO salesman, UserBaseVO materialer, UserBaseVO instorer, DepartmentVO region, DepartmentVO department, DepartmentVO materialDepartment) {
		super();
		this.house = house;
		this.customer = customer;
		this.salesman = salesman;
		this.materialer = materialer;
		this.instorer = instorer;
		this.region = region;
		this.department = department;
		this.materialDepartment = materialDepartment;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public UserBaseVO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserBaseVO materialer) {
		this.materialer = materialer;
	}

	public UserBaseVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserBaseVO instorer) {
		this.instorer = instorer;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Short getPackageFlag() {
		return packageFlag;
	}

	public void setPackageFlag(Short packageFlag) {
		this.packageFlag = packageFlag;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public DepartmentVO getMaterialDepartment() {
		return materialDepartment;
	}

	public void setMaterialDepartment(DepartmentVO materialDepartment) {
		this.materialDepartment = materialDepartment;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getPreBalanceTime() {
		return preBalanceTime;
	}

	public void setPreBalanceTime(Timestamp preBalanceTime) {
		this.preBalanceTime = preBalanceTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getPostBalanceTime() {
		return postBalanceTime;
	}

	public void setPostBalanceTime(Timestamp postBalanceTime) {
		this.postBalanceTime = postBalanceTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getFullpayTime() {
		return fullpayTime;
	}

	public void setFullpayTime(Timestamp fullpayTime) {
		this.fullpayTime = fullpayTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(Short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	public Short getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(Short otherStatus) {
		this.otherStatus = otherStatus;
	}

	public Float getDepositPayment() {
		return depositPayment;
	}

	public void setDepositPayment(Float depositPayment) {
		this.depositPayment = depositPayment;
	}

	public Short getDepositStatus() {
		return depositStatus;
	}

	public void setDepositStatus(Short depositStatus) {
		this.depositStatus = depositStatus;
	}

	public Float getFullPayment() {
		return fullPayment;
	}

	public void setFullPayment(Float fullPayment) {
		this.fullPayment = fullPayment;
	}

	public Short getFullStatus() {
		return fullStatus;
	}

	public void setFullStatus(Short fullStatus) {
		this.fullStatus = fullStatus;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Float getDistotal() {
		return distotal;
	}

	public void setDistotal(Float distotal) {
		this.distotal = distotal;
	}

	public Float getMaling() {
		return maling;
	}

	public void setMaling(Float maling) {
		this.maling = maling;
	}

	public Float getVenderMaling() {
		return venderMaling;
	}

	public void setVenderMaling(Float venderMaling) {
		this.venderMaling = venderMaling;
	}

	public Float getCoupon() {
		return coupon;
	}

	public void setCoupon(Float coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getActivityId() {
		return activityId;
	}

	public void setActivityId(Long activityId) {
		this.activityId = activityId;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}
	
}