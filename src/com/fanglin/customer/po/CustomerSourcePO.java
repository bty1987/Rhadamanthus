package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
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
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customersource", catalog = "customer")
public class CustomerSourcePO implements Serializable {

	private static final long serialVersionUID = 3677398906082994108L;

	public static final String COLUMN_CREATER_STR = "creater.uid";

	public static final String COLUMN_DESIGNER_STR = "designer.uid";

	public static final String COLUMN_SALESMAN_STR = "salesman.uid";

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_TRAN_INT = 2; // 转换

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

	private int freeArea;

	private int totalArea;

	private int innerArea;

	private UserPO creater;

	private Timestamp createTime;

	private int company;

	private short status;

	private String comment;

	private CustomerPO customer;

	private HousePO house;

	private UserPO designer;

	private UserPO salesman;

	private String orderId;

	public CustomerSourcePO() {
		super();
	}

	public CustomerSourcePO(long csid) {
		super();
		this.csid = csid;
	}

	public CustomerSourcePO(VillagePO village, UserPO creater, CustomerPO customer, HousePO house, UserPO designer, UserPO salesman) {
		super();
		this.village = village;
		this.creater = creater;
		this.customer = customer;
		this.house = house;
		this.designer = designer;
		this.salesman = salesman;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "csid")
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

	@Column(name = "freeArea")
	public int getFreeArea() {
		return freeArea;
	}

	public void setFreeArea(int freeArea) {
		this.freeArea = freeArea;
	}

	@Column(name = "totalArea")
	public int getTotalArea() {
		return totalArea;
	}

	public void setTotalArea(int totalArea) {
		this.totalArea = totalArea;
	}

	@Column(name = "innerArea")
	public int getInnerArea() {
		return innerArea;
	}

	public void setInnerArea(int innerArea) {
		this.innerArea = innerArea;
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
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

	@ManyToOne
	@JoinColumn(nullable = true, name = "suid", referencedColumnName = "uid")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public CustomerSourceVO ptv(CustomerSourceVO customerSourceVO) {

		BeanUtil.copyProperties(this, customerSourceVO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		if (customerSourceVO.getHouse() != null) BeanUtil.copyProperties(getHouse(), customerSourceVO.getHouse(), Arrays.asList("village"));
		if (customerSourceVO.getVillage() != null) BeanUtil.copyProperties(getVillage(), customerSourceVO.getVillage(), Arrays.asList("cityProper"));
		if (customerSourceVO.getVillage() != null && customerSourceVO.getVillage().getCityProper() != null && getVillage() != null) BeanUtil.copyProperties(getVillage().getCityProper(), customerSourceVO.getVillage().getCityProper(), Arrays.asList("city"));

		if (customerSourceVO.getCustomer() != null) BeanUtil.copyProperties(getCustomer(), customerSourceVO.getCustomer());

		if (customerSourceVO.getCreater() != null) customerSourceVO.getCreater().setBaseInfo(getCreater());
		if (customerSourceVO.getCreater() != null && customerSourceVO.getCreater().getDept() != null) BeanUtil.copyProperties(getCreater().getDept(), customerSourceVO.getCreater().getDept(), Arrays.asList("fatherDept", "type", "manager"));

		if (customerSourceVO.getDesigner() != null) customerSourceVO.getDesigner().setBaseInfo(getDesigner());
		if (customerSourceVO.getSalesman() != null) customerSourceVO.getSalesman().setBaseInfo(getSalesman());

		return customerSourceVO;
	}
}
