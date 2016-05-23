/**
 * Title: MessagermationPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 */

package com.fanglin.information.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "message", catalog = "platform")
public class MessagePO implements Serializable {

	private static final long serialVersionUID = 7068359813579637502L;
	
	public static final String MESSAGE_STATUS_READED_STR = "已读";
	
	public static final String MESSAGE_STATUS_UNREAD_STR = "未读";

	public static final String MESSAGE_TYPE_SELL_STR = "销售消息";
	
	public static final String MESSAGE_TYPE_RETURN_STR = "退货消息";
	
	public static final String MESSAGE_TYPE_DELIVER_STR = "放线消息";
	
	public static final String MESSAGE_TYPE_BELONG_STR = "归属消息";
	
	public static final String MESSAGE_TYPE_APPROVAL_STR = "审批消息";
	
	public static final String MESSAGE_TYPE_BUDGET_AUDIT_STR = "预算审核消息";
	
	public static final String MESSAGE_TYPE_BACKVISIT_STR = "回访消息";
	
	public static final String MESSAGE_TYPE_MANAGEMENT_STR = "管理消息";
	
	public static final String MESSAGE_TYPE_FEEDBACK_VILLAGE_STR = "楼号审批反馈消息";
	
	public static final String MESSAGE_TYPE_FEEDBACK_CUSTOMER_STR = "客户信息审批反馈消息";
	
	public static final String MESSAGE_TYPE_FEEDBACK_DISCOUNT_STR = "折扣审批反馈消息";
	
	public static final String MESSAGE_TYPE_FEEDBACK_REFUND_STR = "退款审批反馈消息";
	
	private Integer messageId;
	
	private UserPO receiver;
	
	private UserPO sender;
	
	private String type;
	
	private String contents;
	
	private Timestamp createTime;
	
	private String status;
	
	private String args;
	
	public MessagePO(){
		super();
	}

	@Id
	@GeneratedValue
	public Integer getMessageId(){
		return messageId;
	}

	public void setMessageId(Integer messageId){
		this.messageId = messageId;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "receiverId", referencedColumnName = "userId")
	public UserPO getReceiver(){
		return receiver;
	}

	public void setReceiver(UserPO receiver){
		this.receiver = receiver;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "senderId", referencedColumnName = "userId")
	public UserPO getSender(){
		return sender;
	}

	public void setSender(UserPO sender){
		this.sender = sender;
	}

	@Column(nullable = false)
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	@Column(nullable = false)
	public String getContents(){
		return contents;
	}

	public void setContents(String contents){
		this.contents = contents;
	}

	@Column(nullable = false)
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@Column(nullable = false)
	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public String getArgs(){
		return args;
	}

	public void setArgs(String args){
		this.args = args;
	}

}
