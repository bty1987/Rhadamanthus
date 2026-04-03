package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CompanyVO;

public class CustomerCityProperRuleVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long ccrid;

	private CityProperVO city;

	private CompanyVO company;

	private CompanyVO targetCompany;

	private DepartmentVO department;

	private UserBaseVO user;

	private Long dbid;

	private DecorationBusitypeVO decorationBusinessType;

	private Short type;

	private Short priority;

	private Short status;

	private String comment;

	public CustomerCityProperRuleVO() {
		super();
	}

	public Long getCcrid() {
		return ccrid;
	}

	public void setCcrid(Long ccrid) {
		this.ccrid = ccrid;
	}

	public CityProperVO getCity() {
		return city;
	}

	public void setCity(CityProperVO city) {
		this.city = city;
	}

	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
	}

	public CompanyVO getTargetCompany() {
		return targetCompany;
	}

	public void setTargetCompany(CompanyVO targetCompany) {
		this.targetCompany = targetCompany;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public Long getDbid() {
		return dbid;
	}

	public void setDbid(Long dbid) {
		this.dbid = dbid;
	}

	public DecorationBusitypeVO getDecorationBusinessType() {
		return decorationBusinessType;
	}

	public void setDecorationBusinessType(DecorationBusitypeVO decorationBusinessType) {
		this.decorationBusinessType = decorationBusinessType;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPriority() {
		return priority;
	}

	public void setPriority(Short priority) {
		this.priority = priority;
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
