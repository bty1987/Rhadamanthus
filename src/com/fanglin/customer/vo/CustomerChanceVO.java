package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.vo.UserBaseVO;

public class CustomerChanceVO implements Serializable {

	private static final long serialVersionUID = -5223498257185764813L;

	private Long ccid;

	private CustomerVO customer;

	private HouseVO house;

	private CustomerSourceVO source;

	private DecorationBusitypeVO busitype;

	private UserBaseVO belonger;

	private DepartmentVO department;

	private DepartmentVO region;

	private UserBaseVO creater;

	private UserBaseVO issuer;

	private UserBaseVO finer;

	private Timestamp createTime;

	private Timestamp issueTime;

	private Timestamp confirmTime;

	private Timestamp readTime;

	private Timestamp meetTime;

	private Integer rate;

	private Short type;

	private Short status;

	private Short isRead;

	private Short isGroup;

	private Short isPhone;

	private Short isMeet;

	private Short isTrue;

	private Short isFine;

	private Timestamp fineTime;

	private String comment;

	private String annotate;

	private Integer company;

	private String cno;

	public CustomerChanceVO() {
		super();
	}

	public CustomerChanceVO(CustomerVO customer, HouseVO house, CustomerSourceVO source, DecorationBusitypeVO busitype, UserBaseVO creater, UserBaseVO issuer, UserBaseVO finer, UserBaseVO belonger, DepartmentVO department, DepartmentVO region) {

		super();

		this.customer = customer;
		this.house = house;
		this.source = source;
		this.busitype = busitype;
		this.creater = creater;
		this.issuer = issuer;
		this.finer = finer;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
	}

	public Long getCcid() {
		return ccid;
	}

	public void setCcid(Long ccid) {
		this.ccid = ccid;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public CustomerSourceVO getSource() {
		return source;
	}

	public void setSource(CustomerSourceVO source) {
		this.source = source;
	}

	public DecorationBusitypeVO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypeVO busitype) {
		this.busitype = busitype;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getIssuer() {
		return issuer;
	}

	public void setIssuer(UserBaseVO issuer) {
		this.issuer = issuer;
	}

	public UserBaseVO getFiner() {
		return finer;
	}

	public void setFiner(UserBaseVO finer) {
		this.finer = finer;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Timestamp issueTime) {
		this.issueTime = issueTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getReadTime() {
		return readTime;
	}

	public void setReadTime(Timestamp readTime) {
		this.readTime = readTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getMeetTime() {
		return meetTime;
	}

	public void setMeetTime(Timestamp meetTime) {
		this.meetTime = meetTime;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIsRead() {
		return isRead;
	}

	public void setIsRead(Short isRead) {
		this.isRead = isRead;
	}

	public Short getIsGroup() {
		return isGroup;
	}

	public void setIsGroup(Short isGroup) {
		this.isGroup = isGroup;
	}

	public Short getIsPhone() {
		return isPhone;
	}

	public void setIsPhone(Short isPhone) {
		this.isPhone = isPhone;
	}

	public Short getIsMeet() {
		return isMeet;
	}

	public void setIsMeet(Short isMeet) {
		this.isMeet = isMeet;
	}

	public Short getIsTrue() {
		return isTrue;
	}

	public void setIsTrue(Short isTrue) {
		this.isTrue = isTrue;
	}

	public Short getIsFine() {
		return isFine;
	}

	public void setIsFine(Short isFine) {
		this.isFine = isFine;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFineTime() {
		return fineTime;
	}

	public void setFineTime(Timestamp fineTime) {
		this.fineTime = fineTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAnnotate() {
		return annotate;
	}

	public void setAnnotate(String annotate) {
		this.annotate = annotate;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getCno() {
		return cno;
	}

	public void setCno(String cno) {
		this.cno = cno;
	}

}
