package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesProfileVO implements Serializable {

	private static final long serialVersionUID = -7884357679915388249L;

	private Long spid;

	private Long tid;

	private String orderId;

	private String name;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short type;

	private Short status;

	private Long company;

	private List<SalesProfileItemVO> items;
	
	private Long bid;

	public SalesProfileVO() {
		super();
	}

	public SalesProfileVO(UserBaseVO creater, List<SalesProfileItemVO> items) {
		super();
		this.creater = creater;
		this.items = items;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	public Long getCompany() {
		return company;
	}

	public void setCompany(Long company) {
		this.company = company;
	}

	public List<SalesProfileItemVO> getItems() {
		return items;
	}

	public void setItems(List<SalesProfileItemVO> items) {
		this.items = items;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	
}
