package com.fanglin.approval.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "approval", catalog = "platform")
public class ApprovalPO implements java.io.Serializable {

	private static final long serialVersionUID = -4085644657170990542L;
	
	public static final short APPROVAL_TYPE_CUSTOMER_INT = 1;
	
	public static final short APPROVAL_TYPE_VILLAGE_INT = 2;
	
	public static final short APPROVAL_TYPE_ORDER_BELONG_INT = 3;
	
	public static final short APPROVAL_TYPE_QUOTATION_DISCOUNT_INT = 4;
	
	public static final short APPROVAL_TYPE_DECORATION_REFUND_INT = 5;
	
	public static final short APPROVAL_TYPE_MATERIAL_REFUND_INT = 6;
	
	public static final short APPROVAL_TYPE_MATERIAL_OUTSIDE_REFUND_INT = 7;
	
	public static final short APPROVAL_TYPE_DECORATION_ACTIVITY_INT = 8;
	
	public static final short APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT = 9; 
	
	public static final short APPROVAL_STATUS_INIT_INT = 0;
	
	public static final short APPROVAL_STATUS_APPROVAL_INT = 1;
	
	public static final short APPROVAL_STATUS_REFUSE_INT = 2;
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_IDENT_STR = "ident";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_RECEIVER_STR = "receiver";
	
	public static final String APPROVAL_CONTENTS_CUSTOMER_STR = "客户名:%s,电话:%s,修改为客户名:%s,电话:%s";
	
	public static final String APPROVAL_CONTENTS_VILLAGE_STR = "订单号:%s,楼盘:%s,楼号:%s,修改为楼盘:%s,楼号:%s";
	
	public static final String APPROVAL_CONTENTS_ORDER_BELONG_STR = "订单号:%s,类型:%s,现归属:%s比例:%s修改为归属:%s比例:%s";
	
	public static final String APPROVAL_CONTENTS_QUOTATION_DISCOUNT_STR = "订单号:%s,报价编号:%s,折扣:%s,修改为折扣:%s,等级:";
	
	public static final String APPROVAL_CONTENTS_DECORATION_REFUND_STR = "订单号:%s,退款类型:%s,金额:%s";
	
	public static final String APPROVAL_CONTENTS_MATERIAL_REFUND_STR = "订单号:%s,主材订单号:%s,品牌:%s,退款金额:%s";
	
	public static final String APPROVAL_CONTENTS_MATERIAL_OUTSIDE_REFUND_STR = "订单号:%s,楼盘地址:%s,客户名:%s,金额:%s,利润:%s";
	
	public static final String APPROVAL_CONTENTS_DECORATION_ACTIVITY_STR = "订单号:%s,参与活动:%s";
	
	public static final String APPROVAL_CONTENTS_MATERIAL_FULL_PAYMENT_STR = "订单号:%s,子订单号:%s,金额:%s,补款审批";
	
	public static final short APPROVAL_QUOTATION_DISCOUNT_LEVEL_ONE_INT = 1;
	
	public static final short APPROVAL_QUOTATION_DISCOUNT_LEVEL_TWO_INT = 2;

	private int aid;
	
	private UserPO receiver;
	
	private UserPO sender;
	
	private short type;
	
	private String ident;
	
	private short status;
	
	private Timestamp createTime;
	
	private Timestamp approvalTime;
	
	private String contents;
	
	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aId")
	public int getAid() {
		return this.aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "receiverId", referencedColumnName="userId")
	public UserPO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserPO receiver) {
		this.receiver = receiver;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "senderId", referencedColumnName="userId")
	public UserPO getSender() {
		return sender;
	}

	public void setSender(UserPO sender) {
		this.sender = sender;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "ident")
	public String getIdent() {
		return ident;
	}

	public void setIdent(String ident) {
		this.ident = ident;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "approvalTime")
	public Timestamp getApprovalTime() {
		return this.approvalTime;
	}

	public void setApprovalTime(Timestamp approvalTime) {
		this.approvalTime = approvalTime;
	}

	@Column(name = "contents")
	public String getContents() {
		return this.contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}