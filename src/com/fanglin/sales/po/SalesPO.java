package com.fanglin.sales.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "sales", catalog = "sales")
public class SalesPO implements Serializable {

	private static final long serialVersionUID = -2322385203203862761L;

	public static final short STATUS_INIT_SHORT = 0;

	public static final short STATUS_ALLBACK_SHORT = 2;

	public static final short STATUS_DBACKORDER_SHORT = 3;

	public static final short STATUS_WAST_SHORT = 4;

	public static final short STATUS_END_SHORT = 5;

	public static final short TYPE_INIT_INT = 0;

	public static final short TYPE_PROFIT_INT = 1;

	public static final short BALANCESTATUS_INIT_SHORT = 0;

	public static final short BALANCESTATUS_PRESETTLEMENT_SHORT = 1;

	public static final short BALANCESTATUS_VENDORSETTLEMENT_SHORT = 2;

	public static final short BALANCESTATUS_SETTLEMENT_SHORT = 3;

	public static final short BALANCESTATUS_FINISH_SHORT = 4;

	public static final short DESPOSITPAYSTATUS_INIT_SHORT = -1;

	public static final short DESPOSITPAYSTATUS_UNPAY_SHORT = 0;

	public static final short DESPOSITPAYSTATUS_PAYED_SHORT = 1;

	public static final short DESPOSITPAYSTATUS_CONFIRM_SHORT = 2;

	public static final short FULLPAYSTATUS_INIT_SHORT = -1;

	public static final short FULLPAYSTATUS_UNPAY_SHORT = 0;

	public static final short FULLPAYSTATUS_PAYED_SHORT = 1;

	public static final short FULLPAYSTATUS_CONFIRM_SHORT = 2;

	public static final short FULLPAYSTATUS_APPROVAL_INT = 3;

	public static final short CTYPE_RESERVEPRICE_INT = 0;

	public static final short CTYPE_POINT_INT = 1;

	public static final short CTYPE_PASS_INT = 2;

	public static final short ISAFFIRM_AFFIRM_INT = 1;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_BRAND_STR = "brand";

	public static final String COLUMN_CATEGORY_STR = "category";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_DOMPANY_STR = "dompany";

	public static final String COLUMN_POMPANY_STR = "pompany";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_INSTORERID_STR = "instorer.userId";

	public static final String COLUMN_SALESMANID_STR = "salesman.uid";

	public static final String COLUMN_GUID_STR = "guider.uid";

	public static final String COLUMN_GUIDERUSERID_STR = "guider.userId";

	public static final String COLUMN_ISID_STR = "instorer.uid";

	public static final String COLUMN_GUIDERID_STR = "guider.userName";

	public static final String COLUMN_SALESMANUSERID_STR = "salesman.userId";

	public static final String COLUMN_FULLPAYTIME_RANGE_STR = "fullpayTimeRange";

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_BID_STR = "bid";

	public static final String COLUMN_DEPT_STR = "dept.name";

	public static final String COLUMN_FULLPAYTIME_STR = "fullpayTime";

	public static final String COLUMN_FULLPAYSTATUS_STR = "fullpayStatus";

	public static final String COLUMN_BALANCESTATUS_STR = "balanceStatus";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_OCUID_STR = "supplier.uid";

	public static final String COLUMN_IUID_STR = "instorer.uid";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	private long sid;

	private String no;

	private String orderId;

	private UserPO supplier;

	private HousePO house;

	private CustomerPO customer;

	private int company;

	private int dompany;

	private int pompany;

	private String grade;

	private UserPO salesman;

	private DepartmentPO dept;

	private DepartmentPO region;

	private UserPO creater;

	private UserPO guider;

	private DepartmentPO guideDept;

	private UserPO instorer;

	private UserPO finisher;

	private String category;

	private BrandPO brand;

	private String comment;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private Timestamp fullpayTime;

	private Timestamp finishTime;

	private Timestamp affirmTime;

	private short isAffirm;

	private short status;

	private short type;

	private long depositpay;

	private short depositpayStatus;

	private long fullpay;

	private short fullpayStatus;

	private short balanceStatus;

	private long total;

	private long amount;

	private int maling;

	private int venderMaling;

	private int coupon;

	private String couponInfo;

	private short otherStatus;

	private long activityId;

	private short ctype;

	private int cvalue;

	public SalesPO() {
		super();
	}

	public SalesPO(long sid) {
		super();
		this.sid = sid;
	}

	public SalesPO(HousePO house, CustomerPO customer, UserPO salesman, DepartmentPO dept, DepartmentPO region, UserPO guider, DepartmentPO guideDept, UserPO instorer, UserPO supplier, BrandPO brand) {
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
		this.brand = brand;
	}

	@Id
	@GeneratedValue
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ocuid", referencedColumnName = "uid")
	public UserPO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserPO supplier) {
		this.supplier = supplier;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cId", referencedColumnName = "cId")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "dompany")
	public int getDompany() {
		return dompany;
	}

	public void setDompany(int dompany) {
		this.dompany = dompany;
	}

	@Column(name = "pompany")
	public int getPompany() {
		return pompany;
	}

	public void setPompany(int pompany) {
		this.pompany = pompany;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "suId", referencedColumnName = "uId")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "dId", referencedColumnName = "dId")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "rId", referencedColumnName = "dId")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "guId", referencedColumnName = "uId")
	public UserPO getGuider() {
		return guider;
	}

	public void setGuider(UserPO guider) {
		this.guider = guider;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "gdid", referencedColumnName = "dId")
	public DepartmentPO getGuideDept() {
		return guideDept;
	}

	public void setGuideDept(DepartmentPO guideDept) {
		this.guideDept = guideDept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "iuid", referencedColumnName = "uId")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fuid", referencedColumnName = "uId")
	public UserPO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserPO finisher) {
		this.finisher = finisher;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "fullpayTime")
	public Timestamp getFullpayTime() {
		return fullpayTime;
	}

	public void setFullpayTime(Timestamp fullpayTime) {
		this.fullpayTime = fullpayTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "affirmTime")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "depositpay")
	public long getDepositpay() {
		return depositpay;
	}

	public void setDepositpay(long depositpay) {
		this.depositpay = depositpay;
	}

	@Column(name = "depositpayStatus")
	public short getDepositpayStatus() {
		return depositpayStatus;
	}

	public void setDepositpayStatus(short depositpayStatus) {
		this.depositpayStatus = depositpayStatus;
	}

	@Column(name = "fullpay")
	public long getFullpay() {
		return fullpay;
	}

	public void setFullpay(long fullpay) {
		this.fullpay = fullpay;
	}

	@Column(name = "fullpayStatus")
	public short getFullpayStatus() {
		return fullpayStatus;
	}

	public void setFullpayStatus(short fullpayStatus) {
		this.fullpayStatus = fullpayStatus;
	}

	@Column(name = "balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "amount")
	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

	@Column(name = "maling")
	public int getMaling() {
		return maling;
	}

	public void setMaling(int maling) {
		this.maling = maling;
	}

	@Column(name = "venderMaling")
	public int getVenderMaling() {
		return venderMaling;
	}

	public void setVenderMaling(int venderMaling) {
		this.venderMaling = venderMaling;
	}

	@Column(name = "coupon")
	public int getCoupon() {
		return coupon;
	}

	public void setCoupon(int coupon) {
		this.coupon = coupon;
	}

	@Column(name = "couponInfo")
	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	@Column(name = "otherStatus")
	public short getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(short otherStatus) {
		this.otherStatus = otherStatus;
	}

	@Column(name = "activityId")
	public long getActivityId() {
		return activityId;
	}

	public void setActivityId(long activityId) {
		this.activityId = activityId;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	public SalesVO ptv(SalesVO salesVO) {

		BeanUtil.copyProperties(this, salesVO, Arrays.asList("salesman", "dept", "region", "guider", "instorer", "guideDept", "house", "customer", "supplier", "finisher", "creater", "brand"));

		if (salesVO.getHouse() != null && getHouse() != null) getHouse().ptv(salesVO.getHouse());

		if (salesVO.getCustomer() != null && getCustomer() != null) getCustomer().ptv(salesVO.getCustomer());

		if (salesVO.getDept() != null && getDept() != null) getDept().ptv(salesVO.getDept());
		if (salesVO.getRegion() != null && getRegion() != null) getRegion().ptv(salesVO.getRegion());
		if (salesVO.getGuideDept() != null && getGuideDept() != null) getGuideDept().ptv(salesVO.getGuideDept());

		if (salesVO.getCreater() != null && getCreater() != null) salesVO.getCreater().setBaseInfo(getCreater());
		if (salesVO.getSalesman() != null && getSalesman() != null) salesVO.getSalesman().setBaseInfo(getSalesman());
		if (salesVO.getGuider() != null && getGuider() != null) salesVO.getGuider().setBaseInfo(getGuider());
		if (salesVO.getInstorer() != null && getInstorer() != null) salesVO.getInstorer().setBaseInfo(getInstorer());
		if (salesVO.getSupplier() != null && getSupplier() != null) salesVO.getSupplier().setBaseInfo(getSupplier());
		if (salesVO.getFinisher() != null && getFinisher() != null) salesVO.getFinisher().setBaseInfo(getFinisher());

		if (salesVO.getBrand() != null && getBrand() != null) getBrand().ptv(salesVO.getBrand());

		return salesVO;
	}

}
