package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserBaseVO;

public class SalesVO implements Serializable {

	private static final long serialVersionUID = 711873433253802459L;

	private Long sid;

	private String no;

	private String orderId;

	private UserBaseVO supplier;

	private HouseVO house;

	private CustomerVO customer;

	private String dompanys;

	private Integer pompany;

	private String grade;

	private UserBaseVO salesman;

	private DepartmentVO dept;

	private DepartmentVO region;

	private UserBaseVO creater;

	private UserBaseVO guider;

	private DepartmentVO guideDept;

	private UserBaseVO instorer;

	private UserBaseVO finisher;

	private String category;

	private Long bid;

	private String brand;

	private String comment;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private Timestamp fullpayTime;

	private Timestamp finishTime;

	private Timestamp affirmTime;

	private Short isAffirm;

	private Short status;

	private Short type;

	private Long depositpay;

	private Short depositpayStatus;

	private Long fullpay;

	private Short fullpayStatus;

	private Short balanceStatus;

	private Long total;

	private Long amount;

	private Integer maling;

	private Integer venderMaling;

	private Integer coupon;

	private String couponInfo;

	private Short otherStatus;

	private Long activityId;

	private Short ctype;

	private Integer cvalue;

	public SalesVO() {
		super();
	}

	public SalesVO(HouseVO house, CustomerVO customer, UserBaseVO salesman, DepartmentVO dept, DepartmentVO region, UserBaseVO guider, DepartmentVO guideDept, UserBaseVO instorer) {
		super();
		this.house = house;
		this.customer = customer;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.guider = guider;
		this.guideDept = guideDept;
		this.instorer = instorer;
	}

	public SalesVO(HouseVO house, CustomerVO customer, UserBaseVO salesman, DepartmentVO dept, DepartmentVO region, UserBaseVO guider, DepartmentVO guideDept, UserBaseVO instorer, UserBaseVO supplier, UserBaseVO finisher, UserBaseVO creater) {
		super();
		this.house = house;
		this.customer = customer;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.guider = guider;
		this.guideDept = guideDept;
		this.instorer = instorer;
		this.supplier = supplier;
		this.finisher = finisher;
		this.creater = creater;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
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

	public UserBaseVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserBaseVO supplier) {
		this.supplier = supplier;
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

	public String getDompanys() {
		return dompanys;
	}

	public void setDompanys(String dompanys) {
		this.dompanys = dompanys;
	}

	public Integer getPompany() {
		return pompany;
	}

	public void setPompany(Integer pompany) {
		this.pompany = pompany;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getGuider() {
		return guider;
	}

	public void setGuider(UserBaseVO guider) {
		this.guider = guider;
	}

	public DepartmentVO getGuideDept() {
		return guideDept;
	}

	public void setGuideDept(DepartmentVO guideDept) {
		this.guideDept = guideDept;
	}

	public UserBaseVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserBaseVO instorer) {
		this.instorer = instorer;
	}

	public UserBaseVO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserBaseVO finisher) {
		this.finisher = finisher;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFullpayTime() {
		return fullpayTime;
	}

	public void setFullpayTime(Timestamp fullpayTime) {
		this.fullpayTime = fullpayTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	public Short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(Short isAffirm) {
		this.isAffirm = isAffirm;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getDepositpay() {
		return depositpay;
	}

	public void setDepositpay(Long depositpay) {
		this.depositpay = depositpay;
	}

	public Short getDepositpayStatus() {
		return depositpayStatus;
	}

	public void setDepositpayStatus(Short depositpayStatus) {
		this.depositpayStatus = depositpayStatus;
	}

	public Long getFullpay() {
		return fullpay;
	}

	public void setFullpay(Long fullpay) {
		this.fullpay = fullpay;
	}

	public Short getFullpayStatus() {
		return fullpayStatus;
	}

	public void setFullpayStatus(Short fullpayStatus) {
		this.fullpayStatus = fullpayStatus;
	}

	public Short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(Short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	public Integer getMaling() {
		return maling;
	}

	public void setMaling(Integer maling) {
		this.maling = maling;
	}

	public Integer getVenderMaling() {
		return venderMaling;
	}

	public void setVenderMaling(Integer venderMaling) {
		this.venderMaling = venderMaling;
	}

	public Integer getCoupon() {
		return coupon;
	}

	public void setCoupon(Integer coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	public Short getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(Short otherStatus) {
		this.otherStatus = otherStatus;
	}

	public Long getActivityId() {
		return activityId;
	}

	public void setActivityId(Long activityId) {
		this.activityId = activityId;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

}