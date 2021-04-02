package com.fanglin.factory.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "monitor", catalog = "factory")
public class MonitorPO implements java.io.Serializable {

	private static final long serialVersionUID = -7106343553669911296L;
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final short STATUS_SUCCESS_INT = 0;
	
	public static final short STATUS_FAIL_INT = 1;

	private int mid;
	
	private String name;
	
	private String host;
	
	private String type;
	
	private String value;
	
	private String comment;
	
	private short status;
	
	private int count;
	
	private Timestamp updateTime;

	public MonitorPO() {
		super();
	}

	public MonitorPO(String name, String host, String type, String comment) {
		super();
		this.name = name;
		this.host = host;
		this.type = type;
		this.comment = comment;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mid")
	public int getMid() {
		return this.mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
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
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "value")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "count")
	public int getCount() {
		return this.count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

}