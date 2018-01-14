package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class AuditScaleVO implements Serializable {

	private static final long serialVersionUID = -6192527565100234860L;
	
	private Long asid;
	
	private AuditRecordVO auditRecord;
	
	private UserBaseVO belongUser;
	
	private DepartmentVO belongDepartment;
	
	private Float money;
	
	private Short type;
	
	private Short status;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;

	public AuditScaleVO(AuditRecordVO auditRecord, UserBaseVO belongUser,
			DepartmentVO belongDepartment) {
		super();
		this.auditRecord = auditRecord;
		this.belongUser = belongUser;
		this.belongDepartment = belongDepartment;
	}

	public AuditScaleVO(UserBaseVO belongUser,
			DepartmentVO belongDepartment, UserBaseVO creater) {
		super();
		this.belongUser = belongUser;
		this.belongDepartment = belongDepartment;
		this.creater = creater;
	}

	public AuditScaleVO() {
		super();
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	public AuditRecordVO getAuditRecord() {
		return auditRecord;
	}

	public void setAuditRecord(AuditRecordVO auditRecord) {
		this.auditRecord = auditRecord;
	}

	public UserBaseVO getBelongUser() {
		return belongUser;
	}

	public void setBelongUser(UserBaseVO belongUser) {
		this.belongUser = belongUser;
	}

	public DepartmentVO getBelongDepartment() {
		return belongDepartment;
	}

	public void setBelongDepartment(DepartmentVO belongDepartment) {
		this.belongDepartment = belongDepartment;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
