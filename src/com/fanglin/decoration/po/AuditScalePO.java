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
@Table(name = "auditScale", catalog = "decoration")
public class AuditScalePO implements Serializable {

	private static final long serialVersionUID = -6192527565100234860L;
	
	public static final String COLUMN_ARID_STR = "arid";
	
	public static final int STATUS_INIT_INT = 0;
	
	public static final int STATUS_CONFIRM_INT = 1;
	
	public static final int STATUS_CHARGE_INT = 2;
	
	public static final int STATUS_ROLL_INT = 3;
	
	private long asid;
	
	private long arid;
	
	private UserPO belongUser;
	
	private DepartmentPO belongDepartment;
	
	private float money;
	
	private short type;
	
	private short status;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	public AuditScalePO() {
		super();
	}

	public AuditScalePO(UserPO belongUser,
			DepartmentPO belongDepartment) {
		super();
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
	
	@Column(name="arid")
	public long getArid() {
		return arid;
	}

	public void setArid(long arid) {
		this.arid = arid;
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
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
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
