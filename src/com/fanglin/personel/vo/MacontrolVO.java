package com.fanglin.personel.vo;

public class MacontrolVO implements java.io.Serializable {

	private static final long serialVersionUID = 3710410519759906520L;

	private Long mid;

	private String name;

	private String mac;

	private String ip;

	private Long buid;

	private Short status;

	private String comment;

	public MacontrolVO() {
		super();
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Long getBuid() {
		return buid;
	}

	public void setBuid(Long buid) {
		this.buid = buid;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}