package com.fanglin.market.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cnotice", catalog = "market")
public class CnoticePO implements Serializable{
	
	private static final long serialVersionUID = 5052182334022018344L;
	
	public static final String COLUMN_SUID_STR = "suid";	//sender 发起者
	
	public static final String COLUMN_RUID_STR = "ruid";	//receiver 接收者
	
	public static final short COLUMN_UNREAD_INT = 0;		//未读 status为0
	
	public static final short COLUMN_READ_INT = 1;			//已读 status为1
	
	public static final short TYPE_SENDER_INT = 0;			//type用于区分查询发起者和接收者  发起者
	
	public static final short TYPE_RECEIVER_INT = 1;		//接收者
			
	private long cnid;
	
	private long suid;
	
	private long ruid;
	
	private String name;
	
	private String phone;
	
	private short status;
	
	private Timestamp createTime;
	
	private String comment;

	public CnoticePO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}
	
	@Column(name="suid")
	public long getSuid() {
		return suid;
	}

	public void setSuid(long suid) {
		this.suid = suid;
	}

	@Column(name="ruid")
	public long getRuid() {
		return ruid;
	}

	public void setRuid(long ruid) {
		this.ruid = ruid;
	}

	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
