package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;



import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class SalesVO implements Serializable {

	private static final long serialVersionUID = 711873433253802459L;
	
	private long sid;
	
	private String no;
	
	private String orderId;
	
	private VillageVO village;
	
	private String houseNumber;
	
	private CustomerVO customer;
	
	private short company;
	
	private UserVO salesman;
	
	private DepartmentVO dept;
	
	private DepartmentVO region;
	
	private UserVO guider;
	
	private DepartmentVO guideDept;
	
	private UserVO instorer;
	
	private String category;
	
	private String brand;
	
	private String comment;
	
	private Timestamp createTime;
	
	private Timestamp balanceTime;
	
	private Timestamp fullpayTime;
	
	private short status;
	
	private short depositpayStatus;
	
	private short fullpayStatus;
	
	private short balanceStatus;
	
	private float total;
	
	private float maling;
	
	private float venderMaling;
	
	private float coupon;
	
	private String couponInfo;

	public SalesVO() {
		super();
	}
	
	public SalesVO(VillageVO village, CustomerVO customer, UserVO salesman,
			DepartmentVO dept, DepartmentVO region, UserVO guider,
			DepartmentVO guideDept, UserVO instorer) {
		super();
		this.village = village;
		this.customer = customer;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.guider = guider;
		this.guideDept = guideDept;
		this.instorer = instorer;
	}

	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
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

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public short getCompany() {
		return company;
	}

	public void setCompany(short company) {
		this.company = company;
	}

	public UserVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserVO salesman) {
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

	public UserVO getGuider() {
		return guider;
	}

	public void setGuider(UserVO guider) {
		this.guider = guider;
	}

	public DepartmentVO getGuideDept() {
		return guideDept;
	}

	public void setGuideDept(DepartmentVO guideDept) {
		this.guideDept = guideDept;
	}

	public UserVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserVO instorer) {
		this.instorer = instorer;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
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

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getFullpayTime() {
		return fullpayTime;
	}

	public void setFullpayTime(Timestamp fullpayTime) {
		this.fullpayTime = fullpayTime;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public short getDepositpayStatus() {
		return depositpayStatus;
	}

	public void setDepositpayStatus(short depositpayStatus) {
		this.depositpayStatus = depositpayStatus;
	}

	public short getFullpayStatus() {
		return fullpayStatus;
	}

	public void setFullpayStatus(short fullpayStatus) {
		this.fullpayStatus = fullpayStatus;
	}

	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	public float getMaling() {
		return maling;
	}

	public void setMaling(float maling) {
		this.maling = maling;
	}

	public float getVenderMaling() {
		return venderMaling;
	}

	public void setVenderMaling(float venderMaling) {
		this.venderMaling = venderMaling;
	}

	public float getCoupon() {
		return coupon;
	}

	public void setCoupon(float coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

}