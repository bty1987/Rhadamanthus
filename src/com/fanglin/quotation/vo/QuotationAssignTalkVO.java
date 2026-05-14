package com.fanglin.quotation.vo;

import java.sql.Timestamp;

import com.fanglin.personel.vo.UserBaseVO;

/**
 * 报价分配沟通消息 VO
 *
 * @author Claude AI
 * @date 2026-04-30
 */
public class QuotationAssignTalkVO {

	/**
	 * 消息ID
	 */
	private Long qatid;

	/**
	 * 装修单号
	 */
	private String orderId;

	/**
	 * 发送人
	 */
	private UserBaseVO sender;

	/**
	 * 接收人
	 */
	private UserBaseVO receiver;

	/**
	 * 消息内容
	 */
	private String content;

	/**
	 * 发送时间
	 */
	private Timestamp sendTime;

	/**
	 * 消息类型：1-设计师发给预算员，2-预算员发给设计师
	 */
	private Short type;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	// ==================== Getter & Setter ====================

	public Long getQatid() {
		return qatid;
	}

	public void setQatid(Long qatid) {
		this.qatid = qatid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserBaseVO getSender() {
		return sender;
	}

	public void setSender(UserBaseVO sender) {
		this.sender = sender;
	}

	public UserBaseVO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserBaseVO receiver) {
		this.receiver = receiver;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
