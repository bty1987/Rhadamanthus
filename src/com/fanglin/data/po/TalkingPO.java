package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "talking", catalog = "data")
public class TalkingPO implements Serializable {

	private static final long serialVersionUID = -4799155911863356239L;

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_NOT_ENABLE_SHORT = 1;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_STATUS_STR = "status";

	private int tid;

	private String name;

	private short type;

	private String content;

	private short status;

	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "tid")
	public int getTid() {
		return tid;
	}

	public void setTid(int tid) {
		this.tid = tid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

}
