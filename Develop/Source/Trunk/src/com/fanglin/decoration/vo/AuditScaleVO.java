package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class AuditScaleVO implements Serializable {

	private static final long serialVersionUID = -6192527565100234860L;
	
	private Long asid;
	
	private AuditRecordVO auditRecord;
	
	private UserVO belongUser;
	
	private DepartmentVO belongDepartment;
	
	private Float money;
	
	private Integer type;
	
	private Integer status;
	
	private UserVO creater;
	
	private Timestamp createTime;

	public AuditScaleVO(AuditRecordVO auditRecord, UserVO belongUser,
			DepartmentVO belongDepartment) {
		super();
		this.auditRecord = auditRecord;
		this.belongUser = belongUser;
		this.belongDepartment = belongDepartment;
	}

	public AuditScaleVO(AuditRecordVO auditRecord, UserVO belongUser,
			DepartmentVO belongDepartment, UserVO creater) {
		super();
		this.auditRecord = auditRecord;
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

	public UserVO getBelongUser() {
		return belongUser;
	}

	public void setBelongUser(UserVO belongUser) {
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

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
