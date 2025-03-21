package com.fanglin.customer.po;

import java.io.Serializable;
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CustomerCompanyRuleVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customercompanyrule", catalog = "customer")
public class CustomerCompanyRulePO implements Serializable {

	private static final long serialVersionUID = 4774786600915178324L;

	public static final String COLUMN_COMPANY_STR = "cid";

	public static final short TYPE_AREA_INT = 0;

	public static final short TYPE_DEPT_INT = 2;

	private long ccrid;

	private CompanyPO company;

	private DepartmentPO dept;

	private int uppval;

	private int lowval;

	private short type;

	private int companys;

	@Id
	@GeneratedValue
	@Column(name = "ccrid")
	public long getCcrid() {
		return ccrid;
	}

	public void setCcrid(long ccrid) {
		this.ccrid = ccrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@Column(name = "uppval")
	public int getUppval() {
		return uppval;
	}

	public void setUppval(int uppval) {
		this.uppval = uppval;
	}

	@Column(name = "lowval")
	public int getLowval() {
		return lowval;
	}

	public void setLowval(int lowval) {
		this.lowval = lowval;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "companys")
	public int getCompanys() {
		return companys;
	}

	public void setCompanys(int companys) {
		this.companys = companys;
	}

	public CustomerCompanyRuleVO ptv(CustomerCompanyRuleVO customerCompanyRuleVO) throws FLException {

		BeanUtil.copyProperties(this, customerCompanyRuleVO, Arrays.asList("company", "dept", "companys"));

		if (customerCompanyRuleVO.getCompany() != null && getCompany() != null) getCompany().ptv(customerCompanyRuleVO.getCompany());
		if (customerCompanyRuleVO.getDept() != null && getDept() != null) customerCompanyRuleVO.setDept(getDept().ptv());

		return customerCompanyRuleVO;
	}
}
