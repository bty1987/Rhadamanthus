package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "phonecallrecord", catalog = "information")
public class PhoneCallRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = -6036378266132193748L;

	public static final int RECORDTYPE_INIT_INT = 0; // 初始

	public static final int RECORDTYPE_LOCAL_INT = 1; // 本地

	public static final int RECORDTYPE_ONLINE_INT = 2; // 线上

	public static final int RECORDTYPE_FAIL_INT = 3; // 失败

	private long pcrid;

	private long pcid;

	private Integer recordType;

	private String recordUrl;

	public PhoneCallRecordPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pcrid")
	public long getPcrid() {
		return pcrid;
	}

	public void setPcrid(long pcrid) {
		this.pcrid = pcrid;
	}

	@Column(name = "pcid")
	public long getPcid() {
		return pcid;
	}

	public void setPcid(long pcid) {
		this.pcid = pcid;
	}

	@Column(name = "recordType")
	public Integer getRecordType() {
		return recordType;
	}

	public void setRecordType(Integer recordType) {
		this.recordType = recordType;
	}

	@Column(name = "recordUrl")
	public String getRecordUrl() {
		return recordUrl;
	}

	public void setRecordUrl(String recordUrl) {
		this.recordUrl = recordUrl;
	}

}
