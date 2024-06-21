package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.vo.UserBaseVO;

public class CustomerChanceVO implements Serializable {

	private static final long serialVersionUID = -5223498257185764813L;

	private Long ccid;

	private CustomerSourceVO source;

	private DecorationBusitypeVO busitype;

	private UserBaseVO creater;

	private UserBaseVO issuer;

	private Timestamp createTime;

	private Timestamp issueTime;

	private Timestamp confirmTime;

	private UserBaseVO belonger;

	private DepartmentVO department;

	private DepartmentVO region;

	private Integer company;

	private Short type;

	private Short status;

	private String comment;

	public CustomerChanceVO() {
		super();
	}

	public CustomerChanceVO(CustomerSourceVO source, DecorationBusitypeVO busitype, UserBaseVO creater, UserBaseVO issuer, UserBaseVO belonger, DepartmentVO department, DepartmentVO region) {
		super();
		this.source = source;
		this.busitype = busitype;
		this.creater = creater;
		this.issuer = issuer;
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

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Timestamp issueTime) {
		this.issueTime = issueTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
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

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
