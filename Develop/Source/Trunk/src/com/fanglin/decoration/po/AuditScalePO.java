package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "auditScale", catalog = "platform")
public class AuditScalePO implements Serializable {

	private static final long serialVersionUID = -6192527565100234860L;
	
	public static final String COLUMN_ARID_STR = "auditRecord.arid";
	
	public static final int STATUS_INIT_INT = 0;
	
	public static final int STATUS_CONFIRM_INT = 1;
	
	public static final int STATUS_CHARGE_INT = 2;
	
	public static final int STATUS_ROLL_INT = 3;
	
	private long asid;
	
	private AuditRecordPO auditRecord;
	
	private UserPO belongUser;
	
	private DepartmentPO belongDepartment;
	
	private float money;
	
	private int type;
	
	private int status;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	public AuditScalePO() {
		super();
	}

	public AuditScalePO(AuditRecordPO auditRecord, UserPO belongUser,
			DepartmentPO belongDepartment) {
		super();
		this.auditRecord = auditRecord;
		this.belongUser = belongUser;
		this.belongDepartment = belongDepartment;
	}

	@Id
	@GeneratedValue
	@Column(name="asid")
	public long getAsid() {
		return asid;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "arid",referencedColumnName="arid")
	public AuditRecordPO getAuditRecord() {
		return auditRecord;
	}

	public void setAuditRecord(AuditRecordPO auditRecord) {
		this.auditRecord = auditRecord;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "buid",referencedColumnName="uid")
	public UserPO getBelongUser() {
		return belongUser;
	}

	public void setBelongUser(UserPO belongUser) {
		this.belongUser = belongUser;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "bdid",referencedColumnName="did")
	public DepartmentPO getBelongDepartment() {
		return belongDepartment;
	}

	public void setBelongDepartment(DepartmentPO belongDepartment) {
		this.belongDepartment = belongDepartment;
	}

	@Column(name="money")
	public float getMoney() {
		return money;
	}

	public void setMoney(float money) {
		this.money = money;
	}

	@Column(name="type")
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Column(name="status")
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid",referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	
	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}


}
