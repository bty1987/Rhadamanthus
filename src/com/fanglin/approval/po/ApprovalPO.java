package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

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

	public static final short APPROVAL_TYPE_SALES_DIACOUNT_INT = 12;

	public static final short APPROVAL_TYPE_HR_INT = 13;

	public static final short APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT = 14;

	public static final short APPROVAL_TYPE_DECORATION_HOLONOMY_INT = 16;

	public static final short APPROVAL_TYPE_CUSTOMER_ORIGIN_INT = 17;

	public static final short APPROVAL_TYPE_SALESDAYMENT_INT = 18;

	public static final short APPROVAL_STATUS_INIT_INT = 0;

	public static final short APPROVAL_STATUS_APPROVAL_INT = 1;

	public static final short APPROVAL_STATUS_REFUSE_INT = 2;

	public static final short APPROVAL_STATUS_APPROVE_INT = 3;

	public static final short APPROVAL_STATUS_CONFIRM_INT = 5;

	public static final short APPROVAL_STATUS_CONFIRMED_INT = 6;

	public static final short APPROVAL_STATUS_REJECT_INT = 7; // 客户拒绝

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_IDENT_STR = "ident";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_RECEIVER_STR = "receiver";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_APPROVALTIME_STR = "approvalTime";

	public static final String COLUMN_PROCESSINSTANCEID_STR = "processinstanceid";

	private long aid;

	private String orderId;

	private UserPO receiver;

	private UserPO sender;

	private short type;

	private String ident;

	private short status;

	private Timestamp createTime;

	private Timestamp approvalTime;

	private String contents;

	private String comment;

	private String annotate;

	private int company;

	private String piid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ruid", referencedColumnName = "uid")
	public UserPO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserPO receiver) {
		this.receiver = receiver;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "suid", referencedColumnName = "uid")
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

	@Column(name = "annotate")
	public String getAnnotate() {
		return annotate;
	}

	public void setAnnotate(String annotate) {
		this.annotate = annotate;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "piid")
	public String getPiid() {
		return piid;
	}

	public void setPiid(String piid) {
		this.piid = piid;
	}

	public ApprovalPO init(UserPO sender, UserPO receiver, String orderId, String ident, short type, String content, String comment, int company) {

		setSender(sender);
		setReceiver(receiver);

		setOrderId(orderId);
		setIdent(ident);
		setType(type);

		setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		setComment(comment);
		setContents(content);
		setCompany(company);

		return this;
	}

}