package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.customer.vo.CustomerUserRuleItemVO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "customerUserRuleItem", catalog = "customer")
public class CustomerUserRuleItemPO implements Serializable {

	private static final long serialVersionUID = 1886589670333755624L;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	public static final short TYPE_AREA_INT = 0;

	public static final short TYPE_ADVANCE_INT = 1;

	public static final short TYPE_DEPT_INT = 2;

	public static final short TYPE_DEPT_TYPE_INT = 3;

	public static final short TYPE_CITY_INT = 4; // 城区规则（新增）

	public static final short TYPE_USER_INT = 5; // 人员规则（新增）

	public static final short TYPE_AREA_POLLING_INT = 6; // 面积轮训（新增）

	public static final short ISSURPLUS_ENABLE_INT = 0;

	public static final short ISSURPLUS_NONE_INT = 1;

	public static final short ISDELETE_ENABLE_INT = 0;

	public static final short ISDELETE_NONE_INT = 1;

	private long curiid;

	private long curid;

	private DepartmentTypePO departmentType;

	private DepartmentPO department;

	private CityProperPO cityProper;

	private String name;

	private short type;

	private int uppval;

	private int lowval;

	private int chance;

	private short priority;

	private short isSurplus;

	private short isDelete;

	private short status;

	private Timestamp createTime;

	private Timestamp handleTime;

	private Timestamp deleteTime;

	private String comment;

	public CustomerUserRuleItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "curiid")
	public long getCuriid() {
		return curiid;
	}

	public void setCuriid(long curiid) {
		this.curiid = curiid;
	}

	@Column(name = "curid")
	public long getCurid() {
		return curid;
	}

	public void setCurid(long curid) {
		this.curid = curid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "dtid", referencedColumnName = "dtid")
	public DepartmentTypePO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypePO departmentType) {
		this.departmentType = departmentType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cpid", referencedColumnName = "cpid")
	public CityProperPO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper) {
		this.cityProper = cityProper;
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

	@Column(name = "chance")
	public int getChance() {
		return chance;
	}

	public void setChance(int chance) {
		this.chance = chance;
	}

	@Column(name = "priority")
	public short getPriority() {
		return priority;
	}

	public void setPriority(short priority) {
		this.priority = priority;
	}

	@Column(name = "isSurplus")
	public short getIsSurplus() {
		return isSurplus;
	}

	public void setIsSurplus(short isSurplus) {
		this.isSurplus = isSurplus;
	}

	@Column(name = "isDelete")
	public short getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(short isDelete) {
		this.isDelete = isDelete;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "handleTime")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	@Column(name = "deleteTime")
	public Timestamp getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Timestamp deleteTime) {
		this.deleteTime = deleteTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public CustomerUserRuleItemPO award(String orderId, long curid, String name, DepartmentTypePO departmentType) {

		setCurid(curid);
		setName(name);

		setDepartmentType(departmentType);
		setType(TYPE_DEPT_TYPE_INT);

		setUppval(1000);
		setLowval(10000000);

		setIsSurplus(ISSURPLUS_NONE_INT);
		setIsDelete(ISDELETE_ENABLE_INT);
		setStatus(STATUS_INIT_INT);

		setPriority((short) 3);

		setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		setHandleTime(DateUtil.getDateToTimestamp(new Date()));

		setComment(orderId);

		return this;
	}

	public CustomerUserRuleItemVO ptv(CustomerUserRuleItemVO customerUserRuleItemVO) {

		BeanUtil.copyProperties(this, customerUserRuleItemVO, Arrays.asList("departmentType", "department", "cityProper"));

		if (customerUserRuleItemVO.getDepartment() != null && getDepartment() != null) getDepartment().ptv(customerUserRuleItemVO.getDepartment());
		if (customerUserRuleItemVO.getDepartmentType() != null && getDepartmentType() != null) getDepartmentType().ptv(customerUserRuleItemVO.getDepartmentType());
		if (customerUserRuleItemVO.getCityProper() != null && getCityProper() != null) getCityProper().ptv(customerUserRuleItemVO.getCityProper());

		return customerUserRuleItemVO;
	}
}
