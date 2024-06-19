package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CustomerDeptRuleVO implements Serializable {

	private static final long serialVersionUID = 147264708129277445L;

	private Long cdrid;

	private Long did;

	private Short type;

	private Short atttype;

	private Long busitype;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Integer company;

	public CustomerDeptRuleVO() {

		super();
	}

	public CustomerDeptRuleVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getCdrid() {
		return cdrid;
	}

	public void setCdrid(Long cdrid) {
		this.cdrid = cdrid;
	}

	public Long getDid() {
		return did;
	}

	public void setDid(Long did) {
		this.did = did;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Long getBusitype() {
		return busitype;
	}

	public void setBusitype(Long busitype) {
		this.busitype = busitype;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}