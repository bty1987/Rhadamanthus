package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserBaseVO;

public class QeasureVO implements Serializable {

	private static final long serialVersionUID = -2165150769814105906L;

	private Long qmid;

	private Long tid;

	private Long qvid;

	private String orderId;

	private String name;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short type;

	private Short status;

	private Integer company;

	public QeasureVO() {
		super();
	}

	public Long getQmid() {
		return qmid;
	}

	public void setQmid(Long qmid) {
		this.qmid = qmid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
	}

	public Long getQvid() {
		return qvid;
	}

	public void setQvid(Long qvid) {
		this.qvid = qvid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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

}
