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

import com.fanglin.system.po.RolePO;

@Entity
@Table(name = "userrole", catalog = "communion")
public class UserRolePO implements Serializable {

	private static final long serialVersionUID = 5724601059188299457L;

	private long urid;

	private int uid;

	private RolePO role;

	private UserPO creater;

	private Timestamp createTime;

	public UserRolePO() {
		super();
	}

	public UserRolePO(RolePO role, UserPO creater) {
		super();
		this.role = role;
		this.creater = creater;
	}

	public UserRolePO(int uid, RolePO role, UserPO creater) {

		super();

		this.uid = uid;
		this.role = role;

		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "urid")
	public long getUrid() {
		return urid;
	}

	public void setUrid(long urid) {
		this.urid = urid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rid", referencedColumnName = "rid", nullable = false)
	public RolePO getRole() {
		return role;
	}

	public void setRole(RolePO role) {
		this.role = role;
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
