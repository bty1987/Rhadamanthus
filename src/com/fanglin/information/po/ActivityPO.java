package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "activity", catalog = "information")
public class ActivityPO implements java.io.Serializable {

	private static final long serialVersionUID = -649765382182810264L;

	public static final String COLUMN_AID_STR = "aid";

	public static final String COLUMN_CREATEUSERID_STR = "creater.userId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_DEFAULTS_STR = "defaults";

	public static final short STATUS_VALID_INT = 0; // 有效

	public static final short STATUS_UNVALID_INT = 1; // 失效

	public static final short DEFAULTS_DEFAULT_INT = 0; // 默认

	public static final short DEFAULTS_COMMON_INT = 1; // 普通

	public static final short TYPE_DECORATION_INT = 1; // 装修

	public static final short TYPE_MATERIAL_INT = 2; // 主材

	public static final short TYPE_SALES_INT = 3;// 销售

	private long aid;

	private String name;

	private UserPO creater;

	private short status;

	private short type;

	private short defaults;

	private int multiple;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private String content;

	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "defaults")
	public short getDefaults() {
		return defaults;
	}

	public void setDefaults(short defaults) {
		this.defaults = defaults;
	}

	@Column(name = "multiple")
	public int getMultiple() {
		return multiple;
	}

	public void setMultiple(int multiple) {
		this.multiple = multiple;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "content")
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}