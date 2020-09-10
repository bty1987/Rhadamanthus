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

	public static final short STATUS_READED_INT = 1;

	public static final short STATUS_UNREAD_INT = 0;

	public static final short DRESULT_SUCCESS_INT = 0;

	public static final short DRESULT_FAIL_INT = 1;

	public static final short TYPE_PAYMENT_INT = 0;

	public static final short TYPE_SEND_APPROVAL_INT = 1;

	public static final short TYPE_SEND_BLONG_INT = 2;

	public static final short TYPE_SEND_CONSTRUCTION_INT = 3;

	public static final short TYPE_SEND_PERSONEL_INT = 4;

	public static final short TYPE_SEND_VISIT_INT = 5;

	public static final short TYPE_SEND_CUSTOMER_INT = 6;

	public static final short SUBTYPE_ACCESSORIES_INT = 1;// 辅料单

	private long mid;

	private UserPO receiver;

	private UserPO sender;

	private short type;

	private short subtype;

	private long ident;

	private String contents;

	private Timestamp createTime;

	private short status;

	private String args;

	private int company;

	private short dresult;

	public MessagePO() {
		super();
	}

	@Id
	@GeneratedValue
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "ruid", referencedColumnName = "uid")
	public UserPO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserPO receiver) {
		this.receiver = receiver;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSender() {
		return sender;
	}

	public void setSender(UserPO sender) {
		this.sender = sender;
	}

	@Column(nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	public long getIdent() {
		return ident;
	}

	@Column(name = "ident")
	public void setIdent(long ident) {
		this.ident = ident;
	}

	@Column(nullable = false)
	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	@Column(nullable = false)
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(nullable = false)
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "args")
	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	@Column(name = "company")
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
