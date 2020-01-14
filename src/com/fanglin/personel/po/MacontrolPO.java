package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "macontrol", catalog = "communion")
public class MacontrolPO implements java.io.Serializable {

	private static final long serialVersionUID = 345030067788963577L;

	public static final String COLUMN_MAC_STR = "mac";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long mid;

	private String name;

	private String mac;

	private String ip;

	private Long buid;

	private short status;

	private String comment;

	public MacontrolPO() {
		super();
	}

	public MacontrolPO(long mid) {
		super();
		this.mid = mid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mid")
	public long getMid() {
		return this.mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "mac")
	public String getMac() {
		return this.mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	@Column(name = "ip")
	public String getIp() {
		return this.ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	@Column(name = "buid")
	public Long getBuid() {
		return buid;
	}

	public void setBuid(Long buid) {
		this.buid = buid;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}