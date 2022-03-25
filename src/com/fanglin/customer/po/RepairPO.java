package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
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

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "repair", catalog = "customer")
public class RepairPO implements Serializable {

	private static final long serialVersionUID = 5691962581493699899L;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_REPAIR_INT = 1; // 维修

	public static final short STATUS_FINISH_INT = 2; // 维修

	private long rid;

	private long aid;

	private long cnid;

	private UserPO creater;

	private UserPO updater;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Timestamp finishTime;

	private UserPO deliver;

	private UserPO repaier;

	private short status;

	private String content;

	public RepairPO() {
		super();
	}

	public RepairPO(UserPO deliver) {
		super();
		this.deliver = deliver;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "upuid", referencedColumnName = "uid")
	public UserPO getUpdater() {
		return updater;
	}

	public void setUpdater(UserPO updater) {
		this.updater = updater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "duid", referencedColumnName = "uid")
	public UserPO getDeliver() {
		return deliver;
	}

	public void setDeliver(UserPO deliver) {
		this.deliver = deliver;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ruid", referencedColumnName = "uid")
	public UserPO getRepaier() {
		return repaier;
	}

	public void setRepaier(UserPO repaier) {
		this.repaier = repaier;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public RepairPO init(long aid, UserPO creater, UserPO repaier, String content) {

		this.setAid(aid);
		this.setCreater(creater);
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setUpdater(creater);
		this.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setRepaier(repaier);
		this.setStatus(STATUS_INIT_INT);
		this.setContent(content);

		return this;
	}

	public RepairPO save(long aid, UserPO creater) {

		this.setAid(aid);
		this.setCreater(creater);
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setUpdater(creater);
		this.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setRepaier(creater);
		this.setStatus(STATUS_INIT_INT);

		return this;
	}

}
