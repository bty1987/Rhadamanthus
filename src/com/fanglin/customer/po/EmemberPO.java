package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "emember", catalog = "customer")
public class EmemberPO implements Serializable {

	private static final long serialVersionUID = 3597024739732045249L;

	public static final String COLUMN_UNIONID_STR = "unionId";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_PHONE_STR = "phone";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_INT = 0;

	private long emid;

	private String no;

	private String name;

	private String phone;

	private String address;

	private String unionId;

	private String ticket;

	private short status;

	private long activity;

	private Timestamp registerTime;

	@Id
	@GeneratedValue
	@Column(name = "emid")
	public long getEmid() {
		return emid;
	}

	public void setEmid(long emid) {
		this.emid = emid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "ticket")
	public String getTicket() {
		return ticket;
	}

	public void setTicket(String ticket) {
		this.ticket = ticket;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "activity")
	public long getActivity() {
		return activity;
	}

	public void setActivity(long activity) {
		this.activity = activity;
	}

	@Column(name = "registerTime")
	public Timestamp getRegisterTime() {
		return registerTime;
	}

	public void setRegisterTime(Timestamp registerTime) {
		this.registerTime = registerTime;
	}

}
