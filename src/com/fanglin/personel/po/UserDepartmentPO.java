package com.fanglin.personel.po;

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

import com.fanglin.communion.po.DepartmentPO;

@Entity
@Table(name = "userdepartment", catalog = "communion")
public class UserDepartmentPO implements Serializable {

	private static final long serialVersionUID = -9073486016937854511L;

	private long udid;

	private int uid;

	private DepartmentPO department;

	private UserPO creater;

	private Timestamp createTime;

	public UserDepartmentPO() {
		super();
	}

	public UserDepartmentPO(DepartmentPO department, UserPO creater) {
		super();
		this.department = department;
		this.creater = creater;
	}

	public UserDepartmentPO(int uid, DepartmentPO department, UserPO creater) {
		super();
		this.uid = uid;
		this.department = department;
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "udid")
	public long getUdid() {
		return udid;
	}

	public void setUdid(long udid) {
		this.udid = udid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "dId", nullable = false)
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
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

}
