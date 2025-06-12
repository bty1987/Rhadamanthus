package com.fanglin.data.common.vo;

import java.io.Serializable;

public class SupplierSignetVO implements Serializable {

	private static final long serialVersionUID = 7539031381907707882L;

	private Long ssid;

	private Long suid;// 厂商ID

	private String no;

	private String name;

	private String keyword;

	private Short status;

	private String path;

	private String data;

	private String signid;

	private String signno;

	private Short type;

	private String company;

	public SupplierSignetVO() {
		super();
	}

	public Long getSsid() {
		return ssid;
	}

	public void setSsid(Long ssid) {
		this.ssid = ssid;
	}

	public Long getSuid() {
		return suid;
	}

	public void setSuid(Long suid) {
		this.suid = suid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getSignid() {
		return signid;
	}

	public void setSignid(String signid) {
		this.signid = signid;
	}

	public String getSignno() {
		return signno;
	}

	public void setSignno(String signno) {
		this.signno = signno;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
