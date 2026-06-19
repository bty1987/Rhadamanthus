package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CityProperVO;

public class CustomerUserRuleItemVO implements Serializable {

	private static final long serialVersionUID = 6941559609803170652L;

	private Long curiid;

	private Long curid;

	private DepartmentTypeVO departmentType;

	private DepartmentVO department;

	private CityProperVO cityProper;

	private UserBaseVO user; // 关联的用户（type=5时使用）

	private String name;

	private Short type;

	private Integer uppval;

	private Integer lowval;

	private Integer chance;

	private Short priority;

	private Short isSurplus;

	private Short isDelete;

	private Short status;

	private Timestamp createTime;

	private Timestamp handleTime;

	private Timestamp deleteTime;

	private String comment;

	public CustomerUserRuleItemVO() {
		super();
	}

	public CustomerUserRuleItemVO(DepartmentVO department) {
		super();
		this.department = department;
	}

	public CustomerUserRuleItemVO(DepartmentTypeVO departmentType, DepartmentVO department, CityProperVO cityProper) {

		super();

		this.departmentType = departmentType;
		this.department = department;
		this.cityProper = cityProper;
	}

	public Long getCuriid() {
		return curiid;
	}

	public void setCuriid(Long curiid) {
		this.curiid = curiid;
	}

	public Long getCurid() {
		return curid;
	}

	public void setCurid(Long curid) {
		this.curid = curid;
	}

	public DepartmentTypeVO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypeVO departmentType) {
		this.departmentType = departmentType;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public CityProperVO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper) {
		this.cityProper = cityProper;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public Integer getChance() {
		return chance;
	}

	public void setChance(Integer chance) {
		this.chance = chance;
	}

	public Short getPriority() {
		return priority;
	}

	public void setPriority(Short priority) {
		this.priority = priority;
	}

	public Short getIsSurplus() {
		return isSurplus;
	}

	public void setIsSurplus(Short isSurplus) {
		this.isSurplus = isSurplus;
	}

	public Short getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(Short isDelete) {
		this.isDelete = isDelete;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd hh:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd hh:mm:ss")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	@JSON(format = "yyyy-MM-dd hh:mm:ss")
	public Timestamp getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Timestamp deleteTime) {
		this.deleteTime = deleteTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
