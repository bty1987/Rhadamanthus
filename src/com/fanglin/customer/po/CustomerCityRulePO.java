package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CustomerCityRuleVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerCityRule", catalog = "customer")
public class CustomerCityRulePO implements Serializable {

	private static final long serialVersionUID = 1234567890123456789L;

	public static final String COLUMN_CITYID_STR = "cityid";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_STATUS_STR = "status";

	// 规则类型
	public static final short TYPE_COMPANY_INT = 0; // 城区→公司
	public static final short TYPE_DEPT_INT = 1; // 城区→部门
	public static final short TYPE_USER_INT = 2; // 城区→设计师

	// 状态
	public static final short STATUS_ENABLE_INT = 0; // 启用
	public static final short STATUS_DISABLE_INT = 1; // 禁用

	private long ccrid;

	private CityProperPO city;

	private CompanyPO company;

	private CompanyPO targetCompany;

	private DepartmentPO department;

	private UserPO user;

	private short type;

	private short priority;

	private short status;

	private Integer createruid;

	private Timestamp createTime;

	private Integer updateruid;

	private Timestamp updateTime;

	private Timestamp finishTime;

	private String comment;

	public CustomerCityRulePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccrid")
	public long getCcrid() {
		return ccrid;
	}

	public void setCcrid(long ccrid) {
		this.ccrid = ccrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cityid", referencedColumnName = "cpid")
	public CityProperPO getCity() {
		return city;
	}

	public void setCity(CityProperPO city) {
		this.city = city;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CompanyPO getTargetCompany() {
		return targetCompany;
	}

	public void setTargetCompany(CompanyPO targetCompany) {
		this.targetCompany = targetCompany;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "priority")
	public short getPriority() {
		return priority;
	}

	public void setPriority(short priority) {
		this.priority = priority;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createruid")
	public Integer getCreateruid() {
		return createruid;
	}

	public void setCreateruid(Integer createruid) {
		this.createruid = createruid;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateruid")
	public Integer getUpdateruid() {
		return updateruid;
	}

	public void setUpdateruid(Integer updateruid) {
		this.updateruid = updateruid;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public CustomerCityRuleVO ptv(CustomerCityRuleVO customerCityRuleVO) throws FLException {

		BeanUtil.copyProperties(this, customerCityRuleVO, Arrays.asList("city", "company", "targetCompany", "department", "user"));

		if (customerCityRuleVO.getCity() != null && getCity() != null) {
			getCity().ptv(customerCityRuleVO.getCity());
		}

		if (customerCityRuleVO.getCompany() != null && getCompany() != null) {
			getCompany().ptv(customerCityRuleVO.getCompany());
		}

		if (customerCityRuleVO.getTargetCompany() != null && getTargetCompany() != null) {
			getTargetCompany().ptv(customerCityRuleVO.getTargetCompany());
		}

		if (customerCityRuleVO.getDepartment() != null && getDepartment() != null) {
			customerCityRuleVO.setDepartment(getDepartment().ptv());
		}

		if (customerCityRuleVO.getUser() != null && getUser() != null) {
			customerCityRuleVO.getUser().ptv(getUser());
		}

		return customerCityRuleVO;
	}
}
