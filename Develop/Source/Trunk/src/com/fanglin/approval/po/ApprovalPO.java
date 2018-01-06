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
@Table(name = "approval", catalog = "approval")
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

	public static final short APPROVAL_TYPE_SALESREFUND_PAYMENT_INT = 10;

	public static final short APPROVAL_TYPE_MANIFESTDB_INT = 11;
	
	public static final short APPROVAL_TYPE_SALES_DIACOUNT_INT=12;
	
	public static final short APPROVAL_STATUS_INIT_INT = 0;

	public static final short APPROVAL_STATUS_APPROVAL_INT = 1;

	public static final short APPROVAL_STATUS_REFUSE_INT = 2;

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_IDENT_STR = "ident";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_RECEIVER_STR = "receiver";
	// 提交时间
	public static final String COLUMN_CREATETIME_STR = "createTime";
	// 审批时间
	public static final String COLUMN_APPROVALTIME_STR = "approvalTime";

	public static final String APPROVAL_CONTENTS_CUSTOMER_STR = "客户名:%s,修改为客户名:%s,新增电话:%s";

	public static final String APPROVAL_CONTENTS_VILLAGE_STR = "订单号:%s,楼盘:%s,楼号:%s,修改为楼盘:%s,楼号:%s";

	public static final String APPROVAL_CONTENTS_ORDER_BELONG_STR = "订单号:%s,类型:%s,现归属:%s比例:%s修改为归属:%s比例:%s";

	public static final String APPROVAL_CONTENTS_QUOTATION_DISCOUNT_STR = "订单号:%s,报价编号:%s,折扣:%s,修改为折扣:%s";

	public static final String APPROVAL_CONTENTS_DECORATION_REFUND_STR = "订单号:%s,退款类型:%s,金额:%s";

	public static final String APPROVAL_CONTENTS_MATERIAL_REFUND_STR = "订单号:%s,主材订单号:%s,品牌:%s,退款金额:%s,应退金额:%s,类型:%s";

	public static final String APPROVAL_CONTENTS_MATERIAL_OUTSIDE_REFUND_STR = "订单号:%s,楼盘地址:%s,客户名:%s,金额:%s,利润:%s";

	public static final String APPROVAL_CONTENTS_DECORATION_ACTIVITY_STR = "订单号:%s,参与活动:%s";

	public static final String APPROVAL_CONTENTS_MATERIAL_FULL_PAYMENT_STR = "订单号:%s,子订单号:%s,金额:%s,补款审批";
	
	public static final String APPROVAL_CONTENTS_SALES_REFUND_STR = "订单号:%s,销售单号:%s,品牌:%s,退款金额:%s,类型:%s";
	
	public static final String APPROVAL_CONTENTS_MANIFESTDB_STR = "";
	
	public static final String APPROVAL_CONTENTS_SALES_DISCOUNT_STR ="订单号:%s,销售单号:%s,应收金额:%s";

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
	
	private int company;

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
	@JoinColumn(nullable = true, name = "receiverId", referencedColumnName = "userId")
	public UserPO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserPO receiver) {
		this.receiver = receiver;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "senderId", referencedColumnName = "userId")
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
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	
}