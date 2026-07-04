package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ConstructionProfileVO implements Serializable {

	private static final long serialVersionUID = -678004854629620149L;

	private Long cpid;

	private Long tid;

	private Long cid;

	private String orderId;

	private String name;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short type;

	private Short status;

	private Integer company;

	private List<ConstructionProfileItemVO> items;

	public ConstructionProfileVO() {
		super();
	}

	public ConstructionProfileVO(Long tid, String orderId) {
		super();
		this.tid = tid;
		this.orderId = orderId;
	}

	public ConstructionProfileVO(List<ConstructionProfileItemVO> items, UserBaseVO creater) {
		super();
		this.items = items;
		this.creater = creater;
	}

	public ConstructionProfileVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
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

	public List<ConstructionProfileItemVO> getItems() {
		return items;
	}

	public void setItems(List<ConstructionProfileItemVO> items) {
		this.items = items;
	}

}
