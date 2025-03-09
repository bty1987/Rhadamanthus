package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.system.vo.CompanyVO;

public class CustomerCompanyRuleVO implements Serializable {

	private static final long serialVersionUID = -9201837887112446747L;

	private Long ccrid;

	private CompanyVO company;

	private Short type;

	private Integer uppval;

	private Integer lowval;

	private Integer companys;

	public CustomerCompanyRuleVO() {
		super();
	}

	public CustomerCompanyRuleVO(CompanyVO company) {
		super();
		this.company = company;
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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

	public Integer getCompanys() {
		return companys;
	}

	public void setCompanys(Integer companys) {
		this.companys = companys;
	}

}
