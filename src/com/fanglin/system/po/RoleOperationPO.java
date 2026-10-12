package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "roleoperation", catalog = "communion")
public class RoleOperationPO implements java.io.Serializable {

	private static final long serialVersionUID = -5001643145007685798L;

	private int roid;

	private int rid;

	private OperationPO operation;

	private UserPO creater;

	private Timestamp createTime;

	private int company;

	public RoleOperationPO() {
		super();
	}

	public RoleOperationPO(OperationPO operation, int rid, UserPO creater, int company) {

		super();

		this.operation = operation;
		this.rid = rid;
		this.creater = creater;
		this.company = company;
		// 收集/授权行必须盖 createTime, 否则按时间审计收集进度时整批行不可见(生产实证 25988 行 NULL)
		this.createTime = new Timestamp(System.currentTimeMillis());
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "roid")
	public int getRoid() {
		return roid;
	}

	public void setRoid(int roid) {
		this.roid = roid;
	}

	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "oid", referencedColumnName = "oid")
	public OperationPO getOperation() {
		return operation;
	}

	public void setOperation(OperationPO operation) {
		this.operation = operation;
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

}