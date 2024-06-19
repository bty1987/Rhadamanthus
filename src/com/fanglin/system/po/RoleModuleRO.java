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
@Table(name = "rolemodule", catalog = "communion")
public class RoleModuleRO implements java.io.Serializable {

	private static final long serialVersionUID = -6081152605726686260L;

	private int rmId;

	private RolePO role;

	private ModulePO module;

	private short link;

	private short access;

	private UserPO creater;

	private Timestamp createTime;

	private int company;

	public RoleModuleRO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rmid")
	public int getRmId() {
		return this.rmId;
	}

	public void setRmId(int rmId) {
		this.rmId = rmId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "rid", referencedColumnName = "rid")
	public RolePO getRole() {
		return role;
	}

	public void setRole(RolePO role) {
		this.role = role;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "mid", referencedColumnName = "mid")
	public ModulePO getModule() {
		return module;
	}

	public void setModule(ModulePO module) {
		this.module = module;
	}

	public short getLink() {
		return link;
	}

	public void setLink(short link) {
		this.link = link;
	}

	public short getAccess() {
		return access;
	}

	public void setAccess(short access) {
		this.access = access;
	}

	@ManyToOne(fetch = FetchType.EAGER)
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