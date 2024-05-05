package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "events", catalog = "information")
public class EventsPO implements java.io.Serializable {

	private static final long serialVersionUID = 6821683708554610678L;

	public static final String COLUMN_HODERID_STR = "holder.uid";

	public static final String COLUMN_SHOWDATE_STR = "showDate";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short TYPE_SYSTEM_INT = 1;

	public static final short TYPE_CUSTOM_INT = 2;

	public static final short ATTTYPE_CONSTRUCTION_DRAWING_INT = 1;

	private long eid;

	private String orderId;

	private String title;

	private String content;

	private UserPO creater; // 创建人

	private UserPO holder; // 所有人

	private DepartmentPO department; // 归属部门

	private DepartmentPO region; // 归属分区

	private short type;

	private short atttype;

	private Timestamp createTime;

	private int showDate;

	private short isSend;

	public EventsPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "eid")
	public long getEid() {
		return this.eid;
	}

	public void setEid(long eid) {
		this.eid = eid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "huid", referencedColumnName = "uid")
	public UserPO getHolder() {
		return holder;
	}

	public void setHolder(UserPO holder) {
		this.holder = holder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "rid", referencedColumnName = "did")
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

	@Column(name = "showDate")
	public int getShowDate() {
		return this.showDate;
	}

	public void setShowDate(int showDate) {
		this.showDate = showDate;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "isSend")
	public short getIsSend() {
		return isSend;
	}

	public void setIsSend(short isSend) {
		this.isSend = isSend;
	}

	public EventsPO init(String orderId, String title, String content, UserPO holder, short atttype) {

		setOrderId(orderId);

		setTitle(title);
		setContent(content);

		setCreater(holder);
		setHolder(holder);

		setType(TYPE_SYSTEM_INT);
		setAtttype(atttype);

		setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		setShowDate(Integer.parseInt(DateUtil.current("yyyyMMdd")));

		return this;
	}
}