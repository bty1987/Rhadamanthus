/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;
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
@Table(name = "decorationmeasure", catalog = "decoration")
public class DecorationMeasurePO implements Serializable {

	private static final long serialVersionUID = -7484137001624425539L;

	public static final short STATUS_QUEUE_INT = 0;

	public static final short STATUS_APPLICATION_INT = 1;

	public static final short STATUS_SUCCESS_INT = 2;

	public static final short STATUS_FAIL_INT = 3;

	public static final String COLUMN_STARTTIME_STR = "startTime";

	public static final String COLUMN_ENDTIME_STR = "endTime";

	public static final String COLUMN_APPLAYTIME_STR = "applayTime";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String DECORATIONMEASURE_ORDERID_STR = "orderId";

	private long dmid;

	private DecorationPO decoration;

	private Timestamp applayTime;

	private String content;

	private Long actualTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private short status;

	private short count;

	private UserPO appler;

	private UserPO measurer;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "dmid")
	public Long getDmid() {
		return dmid;
	}

	public void setDmid(Long dmid) {
		this.dmid = dmid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "applayTime")
	public Timestamp getApplayTime() {
		return applayTime;
	}

	public void setApplayTime(Timestamp applayTime) {
		this.applayTime = applayTime;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "actualTime")
	public Long getActualTime() {
		return actualTime;
	}

	public void setActualTime(Long actualTime) {
		this.actualTime = actualTime;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getCount() {
		return count;
	}

	public void setCount(Short count) {
		this.count = count;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "apuid", referencedColumnName = "uid")
	public UserPO getAppler() {
		return appler;
	}

	public void setAppler(UserPO appler) {
		this.appler = appler;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "meuid", referencedColumnName = "uid")
	public UserPO getMeasurer() {
		return measurer;
	}

	public void setMeasurer(UserPO measurer) {
		this.measurer = measurer;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
