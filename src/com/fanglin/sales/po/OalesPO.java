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
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "oales", catalog = "sales")
public class OalesPO implements Serializable {

	private static final long serialVersionUID = -7914043988412844614L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_DEPT_STR = "dept.name";

	public static final String COLUMN_REGION_STR = "region.name";

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_SUBMIT_INI = 1;// 提交

	public static final short STATUS_CONFIRM_INI = 2;// 确认

	public static final short STATUS_REJECT_INT = 3;// 驳回

	public static final short STATUS_CHECK_INT = 4;// 复核

	public static final short STATUS_FINISH_INI = 5;// 完结

	public static final short STATUS_INVALID_INI = 6;// 废单

	private long oid;

	private String no;

	private DecorationPO decoration;

	private HousePO house;

	private CustomerPO customer;

	private UserPO supplier;

	private long bid;

	private String category;

	private String brand;

	private short atttype;

	private short awardType;

	private UserPO creater;

	private UserPO servicer;

	private UserPO channer;

	private DepartmentPO dept;

	private DepartmentPO region;

	private Timestamp createTime;

	private long total;

	private long profit;

	private long award;

	private short status;

	private String comment;

	private int company;

	private Timestamp confirmTime;

	private Timestamp checkTime;

	private Timestamp finishTime;

	private UserPO checker;

	private UserPO materialer;

	private int cost;

	private int threshold;

	public OalesPO() {
		super();
	}

	public OalesPO(HousePO house, CustomerPO customer, UserPO supplier) {
		super();
		this.house = house;
		this.customer = customer;
		this.supplier = supplier;
	}

	@Id
	@GeneratedValue
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
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

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "awardType")
	public short getAwardType() {
		return awardType;
	}

	public void setAwardType(short awardType) {
		this.awardType = awardType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserPO supplier) {
		this.supplier = supplier;
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
	@JoinColumn(name = "svuid", referencedColumnName = "uid")
	public UserPO getServicer() {
		return servicer;
	}

	public void setServicer(UserPO servicer) {
		this.servicer = servicer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chauid", referencedColumnName = "uid")
	public UserPO getChanner() {
		return channer;
	}

	public void setChanner(UserPO channer) {
		this.channer = channer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "did", referencedColumnName = "did")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "rid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "profit")
	public long getProfit() {
		return profit;
	}

	public void setProfit(long profit) {
		this.profit = profit;
	}

	@Column(name = "award")
	public long getAward() {
		return award;
	}

	public void setAward(long award) {
		this.award = award;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
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

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "checkTime")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chuid", referencedColumnName = "uid")
	public UserPO getChecker() {
		return checker;
	}

	public void setChecker(UserPO checker) {
		this.checker = checker;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mauid", referencedColumnName = "uid")
	public UserPO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserPO materialer) {
		this.materialer = materialer;
	}

	@Column(name = "cost")
	public int getCost() {
		return cost;
	}

	public void setCost(int cost) {
		this.cost = cost;
	}

	@Column(name = "threshold")
	public int getThreshold() {
		return threshold;
	}

	public void setThreshold(int threshold) {
		this.threshold = threshold;
	}

}
