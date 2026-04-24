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
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.po.DecorationBusitypePO;
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

	public static final short STATUS_DISABLE_INT = 1; // 失效

	public static final short STATUS_APPROVE_ONE_INT = 2; // 审批

	public static final short STATUS_CONFIRM_INT = 3; // 确认

	public static final short STATUS_APPROVE_TWO_INT = 4; // 审批

	public static final short STATUS_TRAN_INT = 5; // 转换

	public static final short CUSTOMEER_TYPE_GO_STORE = 0; // 到店

	public static final short CUSTOMEER_TYPE_MEASUR_ROOM = 1; // 量房

	public static final short CUSTOMEER_TYPE_GUARD_GARDEN = 2; // 守园

	public static final short DEMAND_BASIC_DECORATION = 0; // 基装

	public static final short DEMAND_OVERALL_DECORATION = 1; // 整装

	public static final short DEMAND_LOCAL_DECORATION = 2; // 局改装

	private long csid;

	private String name;

	private String gender;

	private short customerType;

	private short houseAttr;

	private VillagePO village;

	private String houseNumber;

	private DecorationBusitypePO busitype;

	private String phone;

	private String purpose;

	private String intention;

	private short demand;

	private String price;

	private String grade;

	private String referOrderId;

	private String source;

	private String contact;

	private int buildArea;

	private int freeArea;

	private int totalArea;

	private int innerArea;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	private String comment;

	private int company;

	private CustomerPO customer;

	private HousePO house;

	private UserPO designer;

	private UserPO salesman;

	private String orderId;
	
	private String no;

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

	@Column(name = "customertype")
	public short getCustomerType() {
		return customerType;
	}

	public void setCustomerType(short customerType) {
		this.customerType = customerType;
	}

	@Column(name = "houseAttr")
	public short getHouseAttr() {
		return houseAttr;
	}

	public void setHouseAttr(short houseAttr) {
		this.houseAttr = houseAttr;
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

	@Column(name = "referOrderId")
	public String getReferOrderId() {
		return referOrderId;
	}

	public void setReferOrderId(String referOrderId) {
		this.referOrderId = referOrderId;
	}

	@Column(name = "source")
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	@Column(name = "contact")
	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
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

	@ManyToOne
	@JoinColumn(nullable = true, name = "dbid", referencedColumnName = "dbid")
	public DecorationBusitypePO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypePO busitype) {
		this.busitype = busitype;
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

	@Column(name = "demand")
	public Short getDemand() {
		return demand;
	}

	public void setDemand(short demand) {
		this.demand = demand;
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
	
	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public CustomerSourceVO ptv(CustomerSourceVO customerSourceVO) {

		BeanUtil.copyProperties(this, customerSourceVO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman", "houseNumber"));
		customerSourceVO.setHouseNumber(SensitiveDataHelper.decrypt(getHouseNumber()));

		if (customerSourceVO.getHouse() != null && getHouse() != null) getHouse().ptv(customerSourceVO.getHouse());
		if (customerSourceVO.getVillage() != null && getVillage() != null) getVillage().ptv(customerSourceVO.getVillage());

		if (customerSourceVO.getBusitype() != null && getBusitype() != null) getBusitype().ptv(customerSourceVO.getBusitype());

		if (customerSourceVO.getCustomer() != null && getCustomer() != null) getCustomer().ptv(customerSourceVO.getCustomer());

		if (customerSourceVO.getCreater() != null && getCreater() != null) customerSourceVO.getCreater().setBaseInfo(getCreater());
		if (customerSourceVO.getCreater() != null && customerSourceVO.getCreater().getDept() != null) BeanUtil.copyProperties(getCreater().getDept(), customerSourceVO.getCreater().getDept(), Arrays.asList("fatherDept", "type", "manager"));

		if (customerSourceVO.getDesigner() != null && getDesigner() != null) customerSourceVO.getDesigner().setBaseInfo(getDesigner());
		if (customerSourceVO.getSalesman() != null && getSalesman() != null) customerSourceVO.getSalesman().setBaseInfo(getSalesman());

		return customerSourceVO;
	}
}
