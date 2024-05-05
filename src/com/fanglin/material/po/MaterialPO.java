package com.fanglin.material.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "material", catalog = "material")
public class MaterialPO implements java.io.Serializable {

	private static final long serialVersionUID = 5594088406016802710L;

	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";

	public static final String COLUMN_MID_STR = "mid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_VILLAGE_ID_STR = "village";

	public static final String COLUMN_HOUSE_NUMBER__STR = "houseNumber";

	public static final String COLUMN_SALESMAN_STR = "salesman";

	public static final String COLUMN_SALESMANID_STR = "salesman.userId";

	public static final String COLUMN_MATERIALID_STR = "materialer.userId";

	public static final String COLUMN_INSTOREID_STR = "instorer.userId";

	public static final String COLUMN_REGIONID_STR = "regionName";

	public static final String COLUMN_DEPARTMENTID_STR = "departmentName";

	public static final String COLUMN_MATERIALDEPARTMENT_STR = "materialDepartment";

	public static final String COLUMN_DESIGNERFLAG_STR = "designerFlag";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_BALANCESTATUS_STR = "balanceStatus";

	public static final String COLUMN_FULLSTATUS_STR = "fullStatus";

	public static final String COLUMN_FULLPAYTIME_STR = "fullpayTime";

	public static final String COLUMN_FULLCOLLECTTIME_RANGE_STR = "fullpayTimeRange";

	// 静态加载品牌名称
	public static final String COLUMN_MATERIALBRAND_STR = "brand";

	// 增加预结算时间
	public static final String COLUMN_PREBALANCETIME_STR = "preBalanceTime";
	public static final String COLUMN_PREBALANCETIME_RANGE_STR = "preBalanceTimeRange";
	// 增加结算时间
	public static final String COLUMN_POSTBALANCETIME_RANGE_STR = "postBalanceTimeRange";
	public static final String COLUMN_POSTBALANCETIME_STR = "postBalanceTime";
	// 增加厂商结算时间
	public static final String COLUMN_VBALANCETIME_RANGE_STR = "vbalanceTimeRange";
	public static final String COLUMN_VBALANCETIME_STR = "vbBalanceTime";

	public static final short STATUS_TYPE_INIT_INT = 0;// 初始

	public static final short STATUS_TYPE_DELETE_INT = 1;// 删除

	public static final short STATUS_TYPE_REFUND_INT = 2;// 退货

	public static final short STATUS_TYPE_PREBALANCE_INT = 3;// 预结算

	public static final short STATUS_TYPE_ARRIVAL_INT = 4;// ？购货

	public static final short STATUS_TYPE_POSTBALANCE_INT = 5;// 结算

	public static final short STATUS_TYPE_FULLREFUND_INT = 6;// 全退(退货的一种)

	public static final short STATUS_TYPE_DAODAN_INT = 7;// 倒单(退货的一部分)

	public static final short STATUS_TYPE_WASTE_INT = 8;// 作废

	public static final short STATUS_TYPE_FINISH_INT = 9;// 完结(订单的状态)

	public static final short FINANCE_STATUS_TYPE_INIT_INT = 0;// 初始(交款状态)

	public static final short FINANCE_STATUS_TYPE_COMMIT_INT = 1;// 提交

	public static final short FINANCE_STATUS_TYPE_COLLECT_INT = 2;// ?

	public static final short FINANCE_STATUS_TYPE_CONFIRM_INT = 3;// 确认

	public static final short FINANCE_STATUS_TYPE_APPROVAL_INT = 4;

	public static final short BALANCE_STATUS_TYPE_INIT_INT = 0;// 初始(结算状态)

	public static final short BALANCE_STATUS_TYPE_PRE_INT = 1;// 预结算

	public static final short BALANCE_STATUS_TYPE_POST_INT = 2;// 结算

	public static final short DESIGNERFLAG_TYPE_OTHER_INT = 0;

	public static final short DESIGNERFLAG_TYPE_DESIGNER_INT = 1;

	public static final short DESIGNERFLAG_TYPE_SALESMAN_INT = 2;

	public static final short OTHER_STATUS_FULL_PAYMENT_INT = 1;

	public static final short OTHER_STATUS_MEND_INT = 2;// 修理

	public static final short PACKAGE_DISABLE_INT = 0;

	public static final short PACKAGE_ENABLE_INT = 1;

	private long mid;

	private String no;

	private String orderId;

	private HousePO house;

	private CustomerPO customer;

	private UserPO salesman;

	private UserPO materialer;

	private UserPO instorer;

	private String category;

	private long bid;

	private String brand;

	private short packageFlag;

	private DepartmentPO region;

	private DepartmentPO department;

	private DepartmentPO materialDepartment;

	private Timestamp createTime;

	private Timestamp preBalanceTime;

	private Timestamp postBalanceTime;

	private Timestamp fullpayTime;

	private short type;

	private short status;

	private short otherStatus;

	private short balanceStatus;

	private long depositPayment;

	private short depositStatus;

	private long fullPayment;

	private short fullStatus;

	private long total;

	private long distotal;

	private int maling;

	private int venderMaling;

	private int coupon;

	private String couponInfo;

	private String comment;

	private int company;

	private long activityId;

	private String grade;

	public MaterialPO() {
		super();
	}

	public MaterialPO(HousePO house, CustomerPO customer, UserPO salesman, UserPO materialer, UserPO instorer, DepartmentPO region, DepartmentPO department, DepartmentPO materialDepartment) {
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

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mid")
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
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

	@ManyToOne
	@JoinColumn(name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne
	@JoinColumn(name = "customerId", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@ManyToOne
	@JoinColumn(name = "smuid", referencedColumnName = "uid")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@ManyToOne
	@JoinColumn(name = "muid", referencedColumnName = "uid")
	public UserPO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserPO materialer) {
		this.materialer = materialer;
	}

	@ManyToOne
	@JoinColumn(name = "iuid", referencedColumnName = "uid")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	@Column(name = "packageFlag")
	public short getPackageFlag() {
		return packageFlag;
	}

	public void setPackageFlag(short packageFlag) {
		this.packageFlag = packageFlag;
	}

	@ManyToOne
	@JoinColumn(name = "regionId", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@ManyToOne
	@JoinColumn(name = "departmentId", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne
	@JoinColumn(name = "materialDeptId", referencedColumnName = "did")
	public DepartmentPO getMaterialDepartment() {
		return materialDepartment;
	}

	public void setMaterialDepartment(DepartmentPO materialDepartment) {
		this.materialDepartment = materialDepartment;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "preBalanceTime")
	public Timestamp getPreBalanceTime() {
		return preBalanceTime;
	}

	public void setPreBalanceTime(Timestamp preBalanceTime) {
		this.preBalanceTime = preBalanceTime;
	}

	@Column(name = "postBalanceTime")
	public Timestamp getPostBalanceTime() {
		return postBalanceTime;
	}

	public void setPostBalanceTime(Timestamp postBalanceTime) {
		this.postBalanceTime = postBalanceTime;
	}

	@Column(name = "fullpayTime")
	public Timestamp getFullpayTime() {
		return fullpayTime;
	}

	public void setFullpayTime(Timestamp fullpayTime) {
		this.fullpayTime = fullpayTime;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "otherStatus")
	public short getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(short otherStatus) {
		this.otherStatus = otherStatus;
	}

	@Column(name = "balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	@Column(name = "depositPayment")
	public long getDepositPayment() {
		return depositPayment;
	}

	public void setDepositPayment(long depositPayment) {
		this.depositPayment = depositPayment;
	}

	@Column(name = "depositStatus")
	public short getDepositStatus() {
		return depositStatus;
	}

	public void setDepositStatus(short depositStatus) {
		this.depositStatus = depositStatus;
	}

	@Column(name = "fullPayment")
	public long getFullPayment() {
		return fullPayment;
	}

	public void setFullPayment(long fullPayment) {
		this.fullPayment = fullPayment;
	}

	@Column(name = "fullStatus")
	public short getFullStatus() {
		return fullStatus;
	}

	public void setFullStatus(short fullStatus) {
		this.fullStatus = fullStatus;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "distotal")
	public long getDistotal() {
		return distotal;
	}

	public void setDistotal(long distotal) {
		this.distotal = distotal;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "activityId")
	public long getActivityId() {
		return activityId;
	}

	public void setActivityId(long activityId) {
		this.activityId = activityId;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public MaterialVO ptv(MaterialVO materialVO) {

		BeanUtil.copyProperties(this, materialVO, Arrays.asList("house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment"));

		if (materialVO.getHouse() != null) BeanUtil.copyProperties(getHouse(), materialVO.getHouse(), Arrays.asList("village"));
		if (materialVO.getHouse() != null) BeanUtil.copyProperties(getHouse().getVillage(), materialVO.getHouse().getVillage(), Arrays.asList("cityProper"));

		if (materialVO.getCustomer() != null) BeanUtil.copyProperties(getCustomer(), materialVO.getCustomer());

		if (materialVO.getSalesman() != null) BeanUtil.copyProperties(getSalesman(), materialVO.getSalesman(), Arrays.asList("dept", "duty"));
		if (materialVO.getMaterialer() != null) BeanUtil.copyProperties(getMaterialer(), materialVO.getMaterialer(), Arrays.asList("dept", "duty"));
		if (materialVO.getInstorer() != null) BeanUtil.copyProperties(getInstorer(), materialVO.getInstorer(), Arrays.asList("dept", "duty"));

		if (materialVO.getRegion() != null) BeanUtil.copyProperties(getRegion(), materialVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
		if (materialVO.getDepartment() != null) BeanUtil.copyProperties(getDepartment(), materialVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
		if (materialVO.getMaterialDepartment() != null) BeanUtil.copyProperties(getMaterialDepartment(), materialVO.getMaterialDepartment(), Arrays.asList("type", "fatherDept", "manager"));

		return materialVO;
	}

}
