package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CustomerAfterSalesVO implements Serializable {

	private static final long serialVersionUID = -4963666264346504649L;

	private Long asid;

	private String asNo;

	private Short type;

	private Short source;

	private String orderId;

	private Long csid;

	private Long cid;

	private String contactName;

	private String phone;

	private String content;

	private Short priority;

	private Short status;

	private UserBaseVO owner;

	private Integer did;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Timestamp receiveTime;

	private Timestamp handleTime;

	private Timestamp finishTime;

	private Timestamp closeTime;

	private Timestamp responseDeadline;

	private Timestamp finishDeadline;

	private Integer company;

	private String comment;

	public CustomerAfterSalesVO() {
		super();
	}

	public CustomerAfterSalesVO(UserBaseVO creater, UserBaseVO owner) {
		super();
		this.creater = creater;
		this.owner = owner;
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	public String getAsNo() {
		return asNo;
	}

	public void setAsNo(String asNo) {
		this.asNo = asNo;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSource() {
		return source;
	}

	public void setSource(Short source) {
		this.source = source;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getPriority() {
		return priority;
	}

	public void setPriority(Short priority) {
		this.priority = priority;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserBaseVO getOwner() {
		return owner;
	}

	public void setOwner(UserBaseVO owner) {
		this.owner = owner;
	}

	public Integer getDid() {
		return did;
	}

	public void setDid(Integer did) {
		this.did = did;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCloseTime() {
		return closeTime;
	}

	public void setCloseTime(Timestamp closeTime) {
		this.closeTime = closeTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getResponseDeadline() {
		return responseDeadline;
	}

	public void setResponseDeadline(Timestamp responseDeadline) {
		this.responseDeadline = responseDeadline;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishDeadline() {
		return finishDeadline;
	}

	public void setFinishDeadline(Timestamp finishDeadline) {
		this.finishDeadline = finishDeadline;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
