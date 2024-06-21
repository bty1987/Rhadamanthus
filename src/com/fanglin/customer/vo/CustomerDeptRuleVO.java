package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.vo.UserBaseVO;

public class CustomerDeptRuleVO implements Serializable {

	private static final long serialVersionUID = 147264708129277445L;

	private Long cdrid;

	private DepartmentVO department;

	private String name;

	private Short type;

	private Short atttype;

	private DecorationBusitypeVO busitype;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Integer company;

	public CustomerDeptRuleVO() {

		super();
	}

	public CustomerDeptRuleVO(UserBaseVO creater, DepartmentVO department, DecorationBusitypeVO busitype) {
		super();
		this.creater = creater;
		this.department = department;
		this.busitype = busitype;
	}

	public Long getCdrid() {
		return cdrid;
	}

	public void setCdrid(Long cdrid) {
		this.cdrid = cdrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public DecorationBusitypeVO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypeVO busitype) {
		this.busitype = busitype;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}