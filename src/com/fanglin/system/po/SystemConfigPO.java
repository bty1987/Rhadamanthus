package com.fanglin.system.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "systemconfig", catalog = "communion")
public class SystemConfigPO implements Serializable {

	private static final long serialVersionUID = 761154824655519960L;

	public static final String COLUMN_SCID_STR = "scid";

	public static final String COLUMN_KEY_STR = "key";

	public static final String COLUMN_COMPANY_STR = "company";

	private long scid;

	private String group;

	private String key;

	private String value;

	private UserPO creater;

	private Timestamp createTime;

	private String comment;

	private int company;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "scid")
	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
	}

	@Column(name = "group")
	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	@Column(name = "key")
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "value")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public String value(String defaultValue) {
		return getValue() == null ? defaultValue : getValue();
	}

}
