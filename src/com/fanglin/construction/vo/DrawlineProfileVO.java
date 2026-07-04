package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DrawlineProfileVO implements Serializable {

	private static final long serialVersionUID = -678004854629620150L;

	private Long dpid;

	private Long tid;

	private Long dlid;

	private String orderId;

	private String name;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short type;

	private Short status;

	private Integer company;

	private List<DrawlineProfileItemVO> items;

	public DrawlineProfileVO() {
		super();
	}

	public DrawlineProfileVO(Long tid, String orderId) {
		super();
		this.tid = tid;
		this.orderId = orderId;
	}

	public DrawlineProfileVO(List<DrawlineProfileItemVO> items, UserBaseVO creater) {
		super();
		this.items = items;
		this.creater = creater;
	}

	public DrawlineProfileVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getDpid() {
		return dpid;
	}

	public void setDpid(Long dpid) {
		this.dpid = dpid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
	}

	public Long getDlid() {
		return dlid;
	}

	public void setDlid(Long dlid) {
		this.dlid = dlid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
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

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public List<DrawlineProfileItemVO> getItems() {
		return items;
	}

	public void setItems(List<DrawlineProfileItemVO> items) {
		this.items = items;
	}

}
