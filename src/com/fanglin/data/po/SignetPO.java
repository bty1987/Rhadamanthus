package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.fadada.bean.Signet;

@Entity
@Table(name = "signet", catalog = "data")
public class SignetPO implements Serializable, Signet {

	private static final long serialVersionUID = -5044490485583381348L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_REGIST_INT = 1;

	public static final short STATUS_AUTH_INT = 2;

	public static final short STATUS_CONFIRM_INT = 3;

	public static final short STATUS_CANCEL_INT = 5;

	private long sid;

	private String no;

	private String name;

	private String keyword;

	private String path;

	private short status;

	private String signno;

	private String token;

	private String authurl;

	private int company;

	public SignetPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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

	@Column(name = "keyword")
	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public String getSignno() {
		return signno;
	}

	public void setSignno(String signno) {
		this.signno = signno;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getAuthurl() {
		return authurl;
	}

	public void setAuthurl(String authurl) {
		this.authurl = authurl;
	}

	@Override
	public String code() {
		return no;
	}

	@Override
	public String keyword() {
		return keyword;
	}

}
