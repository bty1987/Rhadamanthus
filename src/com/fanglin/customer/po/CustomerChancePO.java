package com.fanglin.customer.po;

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

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerChance", catalog = "customer")
public class CustomerChancePO implements Serializable {

	private static final long serialVersionUID = -5130776675457913941L;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_DISABLE_INT = 1; // 失效

	public static final short STATUS_APPROVE_INT = 2; // 审批

	public static final short STATUS_CONFIRM_INT = 3; // 确认

	public static final short STATUS_COMPLETE_INT = 4; // 完成

	public static final short ATTTYPE_AUTO_INT = 0;

	public static final short ATTTYPE_USER_INT = 1;

	public static final short ATTTYPE_DEPT_INT = 2;

	public static final short ATTTYPE_REGION_INT = 3;

	public static final short ISREAD_READ_INT = 1;// 已读

	public static final short ISFINE_FINE_INT = 1;// 罚款

	public static final short ISMEET_MEET_INT = 2;

	private long ccid;

	private String orderId;

	private CustomerPO customer;

	private HousePO house;

	private CustomerSourcePO source;

	private DecorationBusitypePO busitype;

	private DepartmentPO department;

	private DepartmentPO region;

	private UserPO belonger;

	private UserPO creater;

	private UserPO issuer;

	private UserPO finer;

	private Timestamp createTime;

	private Timestamp issueTime;

	private Timestamp confirmTime;

	private Timestamp readTime;

	private Timestamp fineTime;

	private Timestamp meetTime;

	private int rate;

	private short type;

	private short status;

	private short isRead;

	private short isGroup;

	private short isPhone;

	private short isMeet;

	private short isTrue;

	private short isFine;

	private String comment;

	private int company;

	public CustomerChancePO() {
		super();
	}

	public CustomerChancePO(CustomerPO customer, HousePO house, CustomerSourcePO source, DecorationBusitypePO busitype, UserPO creater, UserPO issuer, UserPO belonger, DepartmentPO department, DepartmentPO region) {

		super();

		this.customer = customer;
		this.house = house;
		this.source = source;
		this.busitype = busitype;
		this.creater = creater;
		this.issuer = issuer;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
	}

	@Id
	@GeneratedValue
	@Column(name = "ccid")
	public long getCcid() {
		return ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cid", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "csid", referencedColumnName = "csid")
	public CustomerSourcePO getSource() {
		return source;
	}

	public void setSource(CustomerSourcePO source) {
		this.source = source;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "dbid", referencedColumnName = "dbid")
	public DecorationBusitypePO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypePO busitype) {
		this.busitype = busitype;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "iuid", referencedColumnName = "uid")
	public UserPO getIssuer() {
		return issuer;
	}

	public void setIssuer(UserPO issuer) {
		this.issuer = issuer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "fuid", referencedColumnName = "uid")
	public UserPO getFiner() {
		return finer;
	}

	public void setFiner(UserPO finer) {
		this.finer = finer;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "issueTime")
	public Timestamp getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Timestamp issueTime) {
		this.issueTime = issueTime;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "readTime")
	public Timestamp getReadTime() {
		return readTime;
	}

	public void setReadTime(Timestamp readTime) {
		this.readTime = readTime;
	}

	@Column(name = "meetTime")
	public Timestamp getMeetTime() {
		return meetTime;
	}

	public void setMeetTime(Timestamp meetTime) {
		this.meetTime = meetTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ddid", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "rdid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@Column(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
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

	@Column(name = "isRead")
	public short getIsRead() {
		return isRead;
	}

	public void setIsRead(short isRead) {
		this.isRead = isRead;
	}

	@Column(name = "isGroup")
	public short getIsGroup() {
		return isGroup;
	}

	public void setIsGroup(short isGroup) {
		this.isGroup = isGroup;
	}

	@Column(name = "isPhone")
	public short getIsPhone() {
		return isPhone;
	}

	public void setIsPhone(short isPhone) {
		this.isPhone = isPhone;
	}

	@Column(name = "isMeet")
	public short getIsMeet() {
		return isMeet;
	}

	public void setIsMeet(short isMeet) {
		this.isMeet = isMeet;
	}

	@Column(name = "isTrue")
	public short getIsTrue() {
		return isTrue;
	}

	public void setIsTrue(short isTrue) {
		this.isTrue = isTrue;
	}

	@Column(name = "isFine")
	public short getIsFine() {
		return isFine;
	}

	public void setIsFine(short isFine) {
		this.isFine = isFine;
	}

	@Column(name = "fineTime")
	public Timestamp getFineTime() {
		return fineTime;
	}

	public void setFineTime(Timestamp fineTime) {
		this.fineTime = fineTime;
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

	public CustomerChanceVO ptv(CustomerChanceVO customerChanceVO) {

		BeanUtil.copyProperties(this, customerChanceVO, Arrays.asList("customer", "house", "source", "busitype", "creater", "issuer", "finer", "belonger", "department", "region"));

		if (customerChanceVO.getHouse() != null && getHouse() != null) getHouse().ptv(customerChanceVO.getHouse());
		if (customerChanceVO.getCustomer() != null) BeanUtil.copyProperties(getCustomer(), customerChanceVO.getCustomer());

		if (customerChanceVO.getSource() != null) getSource().ptv(customerChanceVO.getSource());

		if (customerChanceVO.getBusitype() != null) BeanUtil.copyProperties(getBusitype(), customerChanceVO.getBusitype());

		if (customerChanceVO.getCreater() != null) customerChanceVO.getCreater().setBaseInfo(getCreater());
		if (customerChanceVO.getIssuer() != null) customerChanceVO.getIssuer().setBaseInfo(getIssuer());
		if (customerChanceVO.getFiner() != null) customerChanceVO.getFiner().setBaseInfo(getFiner());
		if (customerChanceVO.getBelonger() != null) customerChanceVO.getBelonger().setBaseInfo(getBelonger());

		if (customerChanceVO.getDepartment() != null && getDepartment() != null) customerChanceVO.setDepartment(getDepartment().ptv());
		if (customerChanceVO.getRegion() != null && getRegion() != null) customerChanceVO.setRegion(getRegion().ptv());

		return customerChanceVO;
	}
}
