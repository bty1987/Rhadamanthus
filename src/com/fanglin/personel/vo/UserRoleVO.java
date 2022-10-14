package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.system.vo.RoleVO;

public class UserRoleVO implements Serializable {

	private static final long serialVersionUID = -8482138249626142819L;

	private Long urid;

	private Integer uid;

	private RoleVO role;

	private UserBaseVO creater;

	private Timestamp createTime;

	public UserRoleVO() {
		super();
	}

	public UserRoleVO(RoleVO role, UserBaseVO creater) {
		super();
		this.role = role;
		this.creater = creater;
	}

	public Long getUrid() {
		return urid;
	}

	public void setUrid(Long urid) {
		this.urid = urid;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public RoleVO getRole() {
		return role;
	}

	public void setRole(RoleVO role) {
		this.role = role;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
