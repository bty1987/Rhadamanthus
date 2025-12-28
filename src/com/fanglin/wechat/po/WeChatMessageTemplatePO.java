package com.fanglin.wechat.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "messagetemplate", catalog = "hades")
public class WeChatMessageTemplatePO implements java.io.Serializable {

	private static final long serialVersionUID = 32712878136020542L;
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final short TYPE_PUBLIC_INT = 0;
	
	public static final short TYPE_APPLET_INT = 1;

	private long mtid;
	
	private String name;
	
	private String no;
	
	private String url;
	
	private String remark;
	
	private short type;
	
	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mtid")
	public long getMtid() {
		return this.mtid;
	}

	public void setMtid(long mtid) {
		this.mtid = mtid;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "no")
	public String getNo() {
		return this.no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "remark")
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "company")
	public int getCompany() {
		return this.company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}