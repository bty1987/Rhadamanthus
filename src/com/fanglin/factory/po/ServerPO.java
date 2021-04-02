package com.fanglin.factory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "server", catalog = "factory")
public class ServerPO implements java.io.Serializable {

	private static final long serialVersionUID = 5690086075809815163L;
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	private int sid;
	
	private String name;
	
	private String host;
	
	private short type;
	
	private int company;
	
	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sid")
	public int getSid() {
		return this.sid;
	}

	public void setSid(int sid) {
		this.sid = sid;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "host")
	public String getHost() {
		return this.host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}