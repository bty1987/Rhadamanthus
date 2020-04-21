package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

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
import com.fanglin.communion.po.VillagePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "customerorigin", catalog = "customer")
public class CustomerOriginPO implements Serializable {

	private static final long serialVersionUID = 5940806639925973280L;

	public static final String COLUMN_BELONGER_STR = "belonger.uid";

	public static final String COLUMN_DESIGNER_STR = "designer.uid";

	public static final short STATUS_INIT_INT = 0; // 初始
	
	public static final short STATUS_FIRSTAPPROVAL_INT = 1; // 初审

	public static final short STATUS_COMMIT_INT = 2; // 提交

	public static final short STATUS_CONFIRM_INT = 3; // 确认

	public static final short STATUS_APPROVE_INT = 4; // 审批

	public static final short STATUS_BIND_INT = 5; // 绑定

	public static final short STATUS_REFUSE_INT = 6; // 拒绝

	private long csid;

	private String name;

	private String gender;

	private String phone;

	private String purpose;

	private String intention;

	private String price;

	private String grade;

	private VillagePO village;

	private String houseNumber;

	private int buildArea;

	private UserPO creater;

	private Timestamp createTime;

	private UserPO belonger;

	private DepartmentPO department;

	private DepartmentPO region;

	private short status;

	private String comment;

	private CustomerPO customer;

	private HousePO house;

	private UserPO designer;

	private String orderId;
	
	private String salesmanType;

	public CustomerOriginPO() {
		super();
	}

	public CustomerOriginPO(long csid) {
		super();
		this.csid = csid;
	}

	public CustomerOriginPO(VillagePO village, UserPO creater, UserPO belonger, DepartmentPO department, DepartmentPO region, CustomerPO customer, HousePO house, UserPO designer) {
		super();
		this.village = village;
		this.creater = creater;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
		this.customer = customer;
		this.house = house;
		this.designer = designer;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "coid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "gender")
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "purpose")
	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	@Column(name = "intention")
	public String getIntention() {
		return intention;
	}

	public void setIntention(String intention) {
		this.intention = intention;
	}

	@Column(name = "price")
	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "vid", referencedColumnName = "vid")
	public VillagePO getVillage() {
		return village;
	}

	public void setVillage(VillagePO village) {
		this.village = village;
	}

	@Column(name = "houseNumber")
	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	@Column(name = "buildArea")
	public int getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(int buildArea) {
		this.buildArea = buildArea;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "rdid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
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

	@ManyToOne
	@JoinColumn(nullable = true, name = "cid", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "duid", referencedColumnName = "uid")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "salesmanType")
	public String getSalesmanType() {
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType) {
		this.salesmanType = salesmanType;
	}

}
