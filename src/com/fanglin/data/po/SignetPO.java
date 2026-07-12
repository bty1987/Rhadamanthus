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

	public static final String COLUMN_PROVIDER_STR = "provider";

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

	private String signid;

	private String signno;

	private String token;

	private String authurl;

	private short type;
	
	private int company;

	private Short provider; // 电子签厂商：1=法大大 2=e签宝（见 ElecsignProvider），存量默认1

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

	@Column(name = "provider")
	public Short getProvider() {
		return provider;
	}

	public void setProvider(Short provider) {
		this.provider = provider;
	}

	@Column(name = "signid")
	public String getSignid() {
		return signid;
	}

	public void setSignid(String signid) {
		this.signid = signid;
	}

	@Column(name = "signno")
	public String getSignno() {
		return signno;
	}

	public void setSignno(String signno) {
		this.signno = signno;
	}

	@Column(name = "token")
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	@Column(name = "authurl")
	public String getAuthurl() {
		return authurl;
	}

	public void setAuthurl(String authurl) {
		this.authurl = authurl;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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
