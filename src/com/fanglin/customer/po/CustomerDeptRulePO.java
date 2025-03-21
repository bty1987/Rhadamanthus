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
import com.fanglin.customer.vo.CustomerDeptRuleVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerdeptrule", catalog = "customer")
public class CustomerDeptRulePO implements Serializable {

	private static final long serialVersionUID = -8946288827140055077L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short TYPE_DEPT_INT = 2;

	public static final short TYPE_RULE_INT = 1;

	public static final short FOCUS_COM_INT = 0;

	public static final short FOCUS_AREA_INT = 1;

	public static final short FOCUS_DEPT_INT = 2;

	private long cdrid;

	private String name;

	private DepartmentPO department;

	private short type;

	private short atttype;

	private DecorationBusitypePO busitype;

	private short focus;

	private UserPO creater;

	private Timestamp createTime;

	private int company;

	public CustomerDeptRulePO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "cdrid")
	public long getCdrid() {
		return cdrid;
	}

	public void setCdrid(long cdrid) {
		this.cdrid = cdrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dbid", referencedColumnName = "dbid")
	public DecorationBusitypePO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypePO busitype) {
		this.busitype = busitype;
	}

	@Column(name = "focus")
	public short getFocus() {
		return focus;
	}

	public void setFocus(short focus) {
		this.focus = focus;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public CustomerDeptRuleVO ptv(CustomerDeptRuleVO customerDeptRuleVO) {

		BeanUtil.copyProperties(this, customerDeptRuleVO, Arrays.asList("creater", "department", "busitype"));

		if (customerDeptRuleVO.getCreater() != null) customerDeptRuleVO.getCreater().setBaseInfo(getCreater());
		if (customerDeptRuleVO.getDepartment() != null) BeanUtil.copyProperties(getDepartment(), customerDeptRuleVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
		if (customerDeptRuleVO.getBusitype() != null) BeanUtil.copyProperties(getBusitype(), customerDeptRuleVO.getBusitype());

		return customerDeptRuleVO;
	}
}
