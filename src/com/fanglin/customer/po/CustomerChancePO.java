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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerChance", catalog = "customer")
public class CustomerChancePO implements Serializable {

	private static final long serialVersionUID = -5130776675457913941L;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_DISTRIBUTION_INT = 1; // 分配

	public static final short STATUS_CONFIRM_INT = 2; // 确认

	public static final short STATUS_APPROVE_INT = 3; // 审批

	public static final short STATUS_COMPLETE_INT = 4; // 完成

	public static final short STATUS_LNVALID_INT = 5; // 失效

	public static final short ATTTYPE_AUTO_INT = 0;

	public static final short ATTTYPE_USER_INT = 1;

	public static final short ATTTYPE_DEPT_INT = 2;

	public static final short ATTTYPE_REGION_INT = 3;

	private long ccid;

	private CustomerSourcePO source;

	private DecorationBusitypePO busitype;

	private UserPO creater;

	private UserPO issuer;

	private Timestamp createTime;

	private Timestamp issueTime;

	private Timestamp confirmTime;

	private UserPO belonger;

	private DepartmentPO department;

	private DepartmentPO region;

	private int company;

	private short type;

	private short status;

	private String comment;

	public CustomerChancePO() {
		super();
	}

	public CustomerChancePO(CustomerSourcePO source, DecorationBusitypePO busitype, UserPO creater, UserPO issuer, UserPO belonger, DepartmentPO department, DepartmentPO region) {
		super();
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public CustomerChanceVO ptv(CustomerChanceVO customerChanceVO) {

		BeanUtil.copyProperties(this, customerChanceVO, Arrays.asList("source", "busitype", "creater", "issuer", "belonger", "department", "region"));

		if (customerChanceVO.getSource() != null) getSource().ptv(customerChanceVO.getSource());

		if (customerChanceVO.getBusitype() != null) BeanUtil.copyProperties(getBusitype(), customerChanceVO.getBusitype());

		if (customerChanceVO.getCreater() != null) customerChanceVO.getCreater().setBaseInfo(getCreater());
		if (customerChanceVO.getIssuer() != null) customerChanceVO.getIssuer().setBaseInfo(getIssuer());
		if (customerChanceVO.getBelonger() != null) customerChanceVO.getBelonger().setBaseInfo(getBelonger());

		if (customerChanceVO.getDepartment() != null && getDepartment() != null) customerChanceVO.setDepartment(getDepartment().ptv());
		if (customerChanceVO.getRegion() != null && getRegion() != null) customerChanceVO.setRegion(getRegion().ptv());

		return customerChanceVO;
	}
}
