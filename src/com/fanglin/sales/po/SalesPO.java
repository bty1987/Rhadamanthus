package com.fanglin.sales.po;

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

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.personel.po.UserPO;


@Entity
@Table(name = "sales", catalog = "sales")
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
	
	public static final String COLUMN_BRAND_STR = "brand";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_DOMPANY_STR = "dompany";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_INSTORERID_STR = "instorer.userId";
	
	public static final String COLUMN_SALESMANID_STR = "salesman.uid";
	
	public static final String COLUMN_GUID_STR = "guider.uid";
	
	public static final String COLUMN_ISID_STR = "instorer.uid";
	
	public static final String COLUMN_GUIDERID_STR = "guider.userName";
	
	public static final String COLUMN_SALESMANUSERID_STR = "salesman.userId";
	
	public static final String COLUMN_FULLPAYTIME_RANGE_STR = "fullpayTimeRange";
	
	public static final String COLUMN_SID_STR ="sid";
	
	public static final String COLUMN_DEPT_STR ="dept.deptName";
	
	public static final String COLUMN_FULLPAYTIME_STR = "fullpayTime";
	
	public static final String COLUMN_FULLPAYSTATUS_STR = "fullpayStatus";
	
	public static final String COLUMN_BALANCESTATUS_STR = "balanceStatus";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	private long sid;
	
	private String no;
	
	private String orderId;
	
	private HousePO house;
	
	private CustomerPO customer;
	
	private int company;
	
	private int dompany;
	
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
	
	private short otherStatus;
	
	public SalesPO() {
		super();
	}

	public SalesPO(HousePO house, CustomerPO customer, UserPO salesman,
			DepartmentPO dept, DepartmentPO region, UserPO guider,
			DepartmentPO guideDept, UserPO instorer) {
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
	@JoinColumn(nullable = false, name = "hid", referencedColumnName="hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cId", referencedColumnName="cId")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}
	
	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name="dompany")
	public int getDompany() {
		return dompany;
	}

	public void setDompany(int dompany) {
		this.dompany = dompany;
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

	@Column(name="otherStatus")
	public short getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(short otherStatus) {
		this.otherStatus = otherStatus;
	}
	
}
