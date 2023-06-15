package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class SurveyVO implements Serializable {

	private static final long serialVersionUID = -2712895059469645238L;

	private Long sid;

	private Long stid;

	private String orderId;

	private String name;

	private UserVO creater;

	private UserVO sender;

	private UserVO finisher;

	private Timestamp createTime;

	private Short status;

	private Integer company;

	private Timestamp sendTime;

	private List<SurveyItemVO> items;

	private Timestamp finishTime;

	private Timestamp handleTime;

	public SurveyVO() {
		super();
	}

	public SurveyVO(Long stid, String orderId) {
		super();
		this.stid = stid;
		this.orderId = orderId;
	}

	public SurveyVO(List<SurveyItemVO> items, UserVO creater, UserVO sender, UserVO finisher) {
		super();
		this.items = items;
		this.creater = creater;
		this.sender = sender;
		this.finisher = finisher;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getStid() {
		return stid;
	}

	public void setStid(Long stid) {
		this.stid = stid;
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

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public UserVO getSender() {
		return sender;
	}

	public void setSender(UserVO sender) {
		this.sender = sender;
	}

	public UserVO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserVO finisher) {
		this.finisher = finisher;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	public List<SurveyItemVO> getItems() {
		return items;
	}

	public void setItems(List<SurveyItemVO> items) {
		this.items = items;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

}
