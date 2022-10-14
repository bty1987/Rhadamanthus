package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.system.vo.CompanyVO;

public class UserCompanyVO implements Serializable {

	private static final long serialVersionUID = 1338233896132683919L;

	private long ucid;

	private int uid;

	private CompanyVO company;

	private UserBaseVO creater;

	private Timestamp createTime;

	public UserCompanyVO() {
		super();
	}

	public UserCompanyVO(CompanyVO company, UserBaseVO creater) {
		super();
		this.company = company;
		this.creater = creater;
	}

	public long getUcid() {
		return ucid;
	}

	public void setUcid(long ucid) {
		this.ucid = ucid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
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
