package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class FeedbackVO implements Serializable {

	private static final long serialVersionUID = -6929197765043316650L;

	private Long fid;

	private String unionId;

	private String content;

	private Timestamp createTime;

	private Short type;

	private String picture;

	private String orderId;

	private String phone;

	private List<String> drawings;

	private String company;

	private UserBaseVO receiver;

	private UserBaseVO finisher;

	private UserBaseVO handler;

	private Timestamp receiveTime;

	private Timestamp handleTime;

	private Timestamp finishTime;

	private short status;

	public FeedbackVO() {
		super();
	}

	public FeedbackVO(UserBaseVO receiver, UserBaseVO handler, UserBaseVO finisher) {
		super();
		this.receiver = receiver;
		this.handler = handler;
		this.finisher = finisher;
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getPhone() {
		return phone;
	}

	public UserBaseVO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserBaseVO receiver) {
		this.receiver = receiver;
	}

	public UserBaseVO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserBaseVO finisher) {
		this.finisher = finisher;
	}

	public UserBaseVO getHandler() {
		return handler;
	}

	public void setHandler(UserBaseVO handler) {
		this.handler = handler;
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

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public List<String> getDrawings() {
		return drawings;
	}

	public void setDrawings(List<String> drawings) {
		this.drawings = drawings;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
