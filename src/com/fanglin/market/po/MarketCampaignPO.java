package com.fanglin.market.po;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "market_campaign", catalog = "market")
public class MarketCampaignPO implements Serializable {

	private static final long serialVersionUID = -2956356807957074557L;

	public static final short STATUS_DRAFT_INT = 0;

	public static final short STATUS_WARM_INT = 1;

	public static final short STATUS_ENABLE_INT = 2;

	public static final short STATUS_DISABLE_INT = 3;

	public static final short STATUS_FINISH_INT = 4;

	public static final short STATUS_ARCHIVE_INT = 5;

	private long mcid;

	private String name;

	private short type;

	private long regionId;

	private long ownerId;

	private BigDecimal budget;

	private Timestamp startTime;

	private Timestamp endTime;

	private short status;

	private String comment;

	private Timestamp createTime;

	private Timestamp updateTime;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "mcid")
	public long getMcid() {
		return mcid;
	}

	public void setMcid(long mcid) {
		this.mcid = mcid;
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

	@Column(name = "regionId")
	public long getRegionId() {
		return regionId;
	}

	public void setRegionId(long regionId) {
		this.regionId = regionId;
	}

	@Column(name = "ownerId")
	public long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(long ownerId) {
		this.ownerId = ownerId;
	}

	@Column(name = "budget")
	public BigDecimal getBudget() {
		return budget;
	}

	public void setBudget(BigDecimal budget) {
		this.budget = budget;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
