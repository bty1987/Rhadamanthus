package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class VustomerVO implements Serializable{

	private static final long serialVersionUID = -4666586604257215679L;
	
	private Long vid;
	
	private String unionId;
	
	private UserBaseVO belonger;
	
	private String name;
	
	private String phone;
	
	private Timestamp createTime;
	
	private String address;
	
	private String orderId;
	
	private Float contractPrice;
	
	private Short status;
	
	private String comment;
	
	public VustomerVO(){
		super();
	}
	
	public VustomerVO(UserBaseVO belonger) {
		super();
		this.belonger = belonger;
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Float contractPrice) {
		this.contractPrice = contractPrice;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
