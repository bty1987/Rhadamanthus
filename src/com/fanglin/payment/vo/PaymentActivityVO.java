package com.fanglin.payment.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.information.vo.ActivityVO;

public class PaymentActivityVO implements java.io.Serializable {

	private static final long serialVersionUID = -1823651725365919478L;

	private Long paid;

	private String orderId;

	private Short type;

	private Long pid;

	private Long rid;

	private ActivityVO activity;

	private Integer realMoney;

	private Integer multiple;

	private Timestamp createTime;

	private String comment;

	public PaymentActivityVO() {
		super();
	}

	public PaymentActivityVO(ActivityVO activity) {
		super();
		this.activity = activity;
	}

	public Long getPaid() {
		return paid;
	}

	public void setPaid(Long paid) {
		this.paid = paid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public ActivityVO getActivity() {
		return activity;
	}

	public void setActivity(ActivityVO activity) {
		this.activity = activity;
	}

	public Integer getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(Integer realMoney) {
		this.realMoney = realMoney;
	}

	public Integer getMultiple() {
		return multiple;
	}

	public void setMultiple(Integer multiple) {
		this.multiple = multiple;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}