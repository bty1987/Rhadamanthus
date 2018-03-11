/**
 * Title: DepartmentPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.system.po.CityProperPO;

@Entity
@Table(name = "department", catalog = "communion")
public class DepartmentPO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;

	public static final String COLUMN_DEPTNAME_STR = "deptName";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_TYPE_STR = "type.dtid";

	public static final short STATUS_DISABLE_INT = 0;

	public static final short STATUS_ENABLE_INT = 1;

	private int did;

	private String deptId;

	private String deptName;

	private String pinyin;

	private DepartmentTypePO type;

	private String subType;

	private String createTime;

	private String des;

	private String contractPrefix;

	private DepartmentPO fatherDept;

	private CityProperPO cityProper;

	private int company;

	private short status;

	public DepartmentPO() {
		super();
	}

	public DepartmentPO(int did) {
		super();
		this.did = did;
	}

	public DepartmentPO(DepartmentTypePO type, DepartmentPO fatherDept,
			CityProperPO cityProper) {

		this.type = type;
		this.fatherDept = fatherDept;
		this.cityProper = cityProper;
	}

	public DepartmentPO(String deptId) {
		super();
		this.deptId = deptId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dId")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	@Column(name = "deptId")
	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	@Column(name = "deptName")
	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "type", referencedColumnName = "dtid")
	public DepartmentTypePO getType() {
		return type;
	}

	public void setType(DepartmentTypePO type) {
		this.type = type;
	}

	@Column(name = "subType")
	public String getSubType() {
		return subType;
	}

	public void setSubType(String subType) {
		this.subType = subType;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "des")
	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

	@Column(name = "contractPrefix")
	public String getContractPrefix() {
		return contractPrefix;
	}

	public void setContractPrefix(String contractPrefix) {
		this.contractPrefix = contractPrefix;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fatherDeptId", referencedColumnName = "did")
	public DepartmentPO getFatherDept() {
		return fatherDept;
	}

	public void setFatherDept(DepartmentPO fatherDept) {
		this.fatherDept = fatherDept;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cityProperId", referencedColumnName = "cpid")
	public CityProperPO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper) {
		this.cityProper = cityProper;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
