package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.system.vo.CompanyVO;

public class CustomerCompanyRuleVO implements Serializable {

	private static final long serialVersionUID = -9201837887112446747L;

	private Long ccrid;

	private CompanyVO company;

	private DepartmentVO dept;

	private Integer uppval;

	private Integer lowval;

	private Short type;

	private Integer companys;

	private Integer cpid; // 城区ID（仅用于查询参数）

	public CustomerCompanyRuleVO() {
		super();
	}

	public CustomerCompanyRuleVO(CompanyVO company, DepartmentVO dept) {
		super();
		this.company = company;
		this.dept = dept;
	}

	public Long getCcrid() {
		return ccrid;
	}

	public void setCcrid(Long ccrid) {
		this.ccrid = ccrid;
	}

	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public Integer getUppval() {
		return uppval;
	}

	public void setUppval(Integer uppval) {
		this.uppval = uppval;
	}

	public Integer getLowval() {
		return lowval;
	}

	public void setLowval(Integer lowval) {
		this.lowval = lowval;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getCompanys() {
		return companys;
	}

	public void setCompanys(Integer companys) {
		this.companys = companys;
	}

	public Integer getCpid() {
		return cpid;
	}

	public void setCpid(Integer cpid) {
		this.cpid = cpid;
	}

}
