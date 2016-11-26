package com.fanglin.information.po;

import java.sql.Timestamp;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "events", catalog = "platform")
public class EventsPO implements java.io.Serializable {

	private static final long serialVersionUID = 6821683708554610678L;
	
	public static final String COLUMN_HODERID_STR = "holder.userId";
	
	public static final String COLUMN_SHOWDATE_STR = "showDate";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final short TYPE_SYSTEM_INT = 1;
	
	public static final short TYPE_CUSTOM_INT = 2;

	private long eid;
	
	private String title;
	
	private String content;
	
	private UserPO creater;
	
	private UserPO holder;
	
	private DepartmentPO department;
	
	private DepartmentPO region;
	
	private short type;
	
	private Timestamp createTime;
	
	private Date showDate;

	public EventsPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "eId")
	public long getEid() {
		return this.eid;
	}

	public void setEid(long eid) {
		this.eid = eid;
	}

	@Column(name = "title")
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "content")
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "createrId", referencedColumnName="userId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "holderId", referencedColumnName="userId")
	public UserPO getHolder() {
		return holder;
	}

	public void setHolder(UserPO holder) {
		this.holder = holder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "deptId", referencedColumnName="deptId")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "regionId", referencedColumnName="deptId")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "showDate")
	public Date getShowDate() {
		return this.showDate;
	}

	public void setShowDate(Date showDate) {
		this.showDate = showDate;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

}