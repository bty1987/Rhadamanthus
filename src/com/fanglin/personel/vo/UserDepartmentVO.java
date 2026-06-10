package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;

public class UserDepartmentVO implements Serializable {

	private static final long serialVersionUID = 1338233896132683920L;

	private long udid;

	private int uid;

	private DepartmentVO department;

	private UserBaseVO creater;

	private Timestamp createTime;

	public UserDepartmentVO() {
		super();
	}

	public UserDepartmentVO(DepartmentVO department, UserBaseVO creater) {
		super();
		this.department = department;
		this.creater = creater;
	}

	public long getUdid() {
		return udid;
	}

	public void setUdid(long udid) {
		this.udid = udid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
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
