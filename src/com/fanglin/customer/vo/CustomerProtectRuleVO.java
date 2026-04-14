package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.personel.vo.UserVO;

public class CustomerProtectRuleVO implements Serializable {

	private static final long serialVersionUID = -2474416082311363253L;

	private Long cprid;

	private String title;

	private Short type;

	private Integer uppval;

	private Integer lowval;

	private DutyVO duty;

	private Integer days;

	private UserVO creater;

	private Timestamp createTime;

	private Short status;

	private Integer company;

	private Long hid;

	private Long cid;

	private String orderId;

	private Short mergeFlag;

	public CustomerProtectRuleVO() {
		super();
	}

	public CustomerProtectRuleVO(UserVO creater) {
		super();
		this.creater = creater;
	}

	public Long getCprid() {
		return cprid;
	}

	public void setCprid(Long cprid) {
		this.cprid = cprid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getUppval() {
		return uppval;
	}

	public void setUppval(Integer uppval) {
		this.uppval = uppval;
	}

	public Integer getLowval() {
		return lowval;
	}

	public void setLowval(Integer lowval) {
		this.lowval = lowval;
	}

	public DutyVO getDuty() {
		return duty;
	}

	public void setDuty(DutyVO duty) {
		this.duty = duty;
	}

	public Integer getDays() {
		return days;
	}

	public void setDays(Integer days) {
		this.days = days;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getHid() {
		return hid;
	}

	public void setHid(Long hid) {
		this.hid = hid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getMergeFlag() {
		return mergeFlag;
	}

	public void setMergeFlag(Short mergeFlag) {
		this.mergeFlag = mergeFlag;
	}

}
