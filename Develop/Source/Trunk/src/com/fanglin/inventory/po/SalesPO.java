package com.fanglin.inventory.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;


@Entity
@Table(name = "sales", catalog = "inventory")
public class SalesPO implements Serializable {
	
	private static final long serialVersionUID = -2322385203203862761L;
	
	public static final short STATUS_INIT_SHORT = 0; 
	
	public static final short STATUS_ALLBACK_SHORT = 2; 
	
	public static final short STATUS_DBACKORDER_SHORT = 3; 
		
	public static final short STATUS_WAST_SHORT = 4; 
		
	public static final short STATUS_END_SHORT = 5; 

	public static final short TYPE_DEPOSIT_SHORT = 2; 
	
	public static final short TYPE_FULLAMOUNT_SHORT = 3; 
	
	public static final short TYPE_REFUNDFULL_SHORT = 5; 
	
	public static final short TYPE_REFUNDCOUPON_SHORT = 6; 
		
	public static final short TYPE_REFUNDDEPOSIT_SHORT = 7; 
	
	public static final short BALANCESTATUS_INIT_SHORT = 0; 
	
	public static final short BALANCESTATUS_PRESETTLEMENT_SHORT = 1; 
	
	public static final short BALANCESTATUS_VENDORSETTLEMENT_SHORT = 2; 
		
	public static final short BALANCESTATUS_SETTLEMENT_SHORT = 3; 
	
	public static final short DESPOSITPAYSTATUS_INIT_SHORT = -1;
	
	public static final short DESPOSITPAYSTATUS_UNPAY_SHORT = 0;
	
	public static final short DESPOSITPAYSTATUS_PAYED_SHORT = 1;
	
	public static final short DESPOSITPAYSTATUS_CONFIRM_SHORT = 2;
	
	public static final short FULLPAYSTATUS_INIT_SHORT = -1;
	
	public static final short FULLPAYSTATUS_UNPAY_SHORT = 0;
	
	public static final short FULLPAYSTATUS_PAYED_SHORT = 1;
	
	public static final short FULLPAYSTATUS_CONFIRM_SHORT = 2;
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_INSTORERID_STR = "instorer.currentName";
	
	public static final String COLUMN_SALESMANID_STR = "salesman.uid";
	
	public static final String COLUMN_GUIDERID_STR = "guider.userName";
	
	public static final String COLUMN_SALESMANNAME_STR = "salesman.userName";
	
	public static final String COLUMN_FULLPAYTIME_RANGE_STR = "fullpayTimeRange";
	
	public static final String COLUMN_SID_STR ="sid";
	
	public static final String COLIMN_DEPT_STR ="dept.deptName";
	
	public static final String COLIMN_FULLPAYTIME_STR = "fullpayTime";
	
	private long sid;
	
	private String no;
	
	private String orderId;
	
	private VillagePO village;
	
	private String houseNumber;
	
	private CustomerPO customer;
	
	private short company;
	
	private UserPO salesman;
	
	private DepartmentPO dept;
	
	private DepartmentPO region;
	
	private UserPO guider;
	
	private DepartmentPO guideDept;
	
	private UserPO instorer;
	
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
	
	public SalesPO() {
		super();
	}

	public SalesPO(VillagePO village, CustomerPO customer, UserPO salesman,
			DepartmentPO dept, DepartmentPO region, UserPO guider,
			DepartmentPO guideDept, UserPO instorer) {
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

	@Id
	@GeneratedValue
	@Column(name="sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}
	
	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	@Column(name="orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "vId", referencedColumnName="vId")
	public VillagePO getVillage() {
		return village;
	}

	public void setVillage(VillagePO village) {
		this.village = village;
	}
	
	@Column(name="houseNumber")
	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cId", referencedColumnName="customerId")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(name="company")
	public short getCompany() {
		return company;
	}

	public void setCompany(short company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "suId", referencedColumnName="uId")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "dId", referencedColumnName="dId")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "rId", referencedColumnName="dId")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "guId", referencedColumnName="uId")
	public UserPO getGuider() {
		return guider;
	}

	public void setGuider(UserPO guider) {
		this.guider = guider;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "gdid", referencedColumnName="dId")
	public DepartmentPO getGuideDept() {
		return guideDept;
	}

	public void setGuideDept(DepartmentPO guideDept) {
		this.guideDept = guideDept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "iuid", referencedColumnName="uId")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}
	
	@Column(name="category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	@Column(name="brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}
	
	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@Column(name="balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}
	
	@Column(name="fullpayTime")
	public Timestamp getFullpayTime() {
		return fullpayTime;
	}

	public void setFullpayTime(Timestamp fullpayTime) {
		this.fullpayTime = fullpayTime;
	}
	
	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name="depositpayStatus")
	public short getDepositpayStatus() {
		return depositpayStatus;
	}

	public void setDepositpayStatus(short depositpayStatus) {
		this.depositpayStatus = depositpayStatus;
	}
	
	@Column(name="fullpayStatus")
	public short getFullpayStatus() {
		return fullpayStatus;
	}

	public void setFullpayStatus(short fullpayStatus) {
		this.fullpayStatus = fullpayStatus;
	}
	
	@Column(name="balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}
	
	@Column(name="total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}
	
	@Column(name="maling")
	public float getMaling() {
		return maling;
	}

	public void setMaling(float maling) {
		this.maling = maling;
	}
	
	@Column(name="venderMaling")
	public float getVenderMaling() {
		return venderMaling;
	}

	public void setVenderMaling(float venderMaling) {
		this.venderMaling = venderMaling;
	}
	
	@Column(name="coupon")
	public float getCoupon() {
		return coupon;
	}

	public void setCoupon(float coupon) {
		this.coupon = coupon;
	}

	@Column(name="couponInfo")
	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}


}
