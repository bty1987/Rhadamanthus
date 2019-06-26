/**
 * @File Name	: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

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

import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "drawline", catalog = "construction")
public class DrawLinePO implements Serializable {

	private static final long serialVersionUID = 1344461146L;

	public static final String COLUMN_STARTTIME_STR = "startTime";

	public static final String COLUMN_ENDTIME_STR = "endTime";

	public static final short STATUS_QUEUE_INT = 0;

	public static final short STATUS_APPLICATION_INT = 1;

	public static final short STATUS_SUCCESS_INT = 2;

	public static final short STATUS_FAIL_INT = 3;

	private long dlid;

	private DecorationPO decoration;

	private Timestamp applayTime;

	private String content;

	private long actualTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private short status;

	private Integer count;

	private UserPO appler;

	private DrawLineGroupPO group;

	private UserPO drawer;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "dlid")
	public long getDlid() {
		return dlid;
	}

	public void setDlid(long dlid) {
		this.dlid = dlid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "auid", referencedColumnName = "uid")
	public UserPO getAppler() {
		return appler;
	}

	public void setAppler(UserPO appler) {
		this.appler = appler;
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
	public long getActualTime() {
		return actualTime;
	}

	public void setActualTime(long actualTime) {
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "count")
	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "dgid", referencedColumnName = "gid")
	public DrawLineGroupPO getGroup() {
		return group;
	}

	public void setGroup(DrawLineGroupPO group) {
		this.group = group;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "dluid", referencedColumnName = "uid")
	public UserPO getDrawer() {
		return drawer;
	}

	public void setDrawer(UserPO drawer) {
		this.drawer = drawer;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
