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
@Table(name = "message", catalog = "information")
public class MessagePO implements Serializable {

	private static final long serialVersionUID = 7068359813579637502L;
	
	public static final short MESSAGE_STATUS_READED_STR = 1;    
	
	public static final short MESSAGE_STATUS_UNREAD_STR = 0;  
	
	public static final short MESSAGE_DRESULT_SUCCESS_STR = 0;    
	
	public static final short MESSAGE_DRESULT_FAIL_STR = 1;  
	
	public static final String MESSAGE_TYPE_RETURN_STR = "退货消息";       
	
	public static final String MESSAGE_TYPE_DELIVER_STR = "放线消息";  
	
	public static final String MESSAGE_TYPE_APPROVAL_STR = "审批消息";  
	
	public static final String MESSAGE_TYPE_BUDGET_AUDIT_STR = "预算审核消息";  
	
	public static final short MESSAGE_TYPE_PAYMENT_STR = 0 ;  
	
	public static final short MESSAGE_TYPE_SEND_APPROVAL_STR = 1 ; 
	
	public static final short MESSAGE_TYPE_SEND_BLONG_STR = 2 ; 
	
	public static final short MESSAGE_TYPE_SEND_CONSTRUCTION_STR = 3 ; 
	
	public static final short MESSAGE_TYPE_SEND_PERSONEL_STR = 4 ;
	
	public static final short MESSAGE_TYPE_SEND_VISIT_STR = 5 ;
	
	private int mid;
	
	private UserPO receiver;
	
	private UserPO sender;
	
	private short type;
	
	private String contents;
	
	private Timestamp createTime;
	
	private short status;
	
	private String args;
	
	private int company;
	
	private short dresult;
	
	public MessagePO(){
		super();
	}

	@Id
	@GeneratedValue
	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
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
	@javax.persistence.JoinColumn(name = "senderId", referencedColumnName = "userId")
	public UserPO getSender(){
		return sender;
	}

	public void setSender(UserPO sender){
		this.sender = sender;
	}

	@Column(nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
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
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name="args")
	public String getArgs(){
		return args;
	}

	public void setArgs(String args){
		this.args = args;
	}

	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(nullable = false)
	public short getDresult() {
		return dresult;
	}

	public void setDresult(short dresult) {
		this.dresult = dresult;
	}
	
}
