package com.fanglin.customer.po;

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

import com.fanglin.communion.po.BrandPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.decoration.po.DecorationPO;

@Entity
@Table(name = "complain", catalog = "customer")
public class ComplainPO implements Serializable {
	
	private static final long serialVersionUID = 8819120114431102636L;
	
	public static final short STATUS_DISPOSE_SHORT = 1;
	
	public static final short STATUS_END_SHORT = 2;
	
	public static final short STATUS_CLOSE_SHORT = 3;
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_CSID_STR = "csid";
	
	public static final String COLUMN_ORDERID_STR = "decoration.orderId";

	private long cid;
	
	private long csid;
		
	private short type;
	
	private DecorationPO decoration;
	
	private UserPO creater;
	
	private UserPO updater;
	
	private Timestamp createTime;
	
	private Timestamp updateTime;
	
	private Timestamp finishTime;
	
	private short level;
	
	private short status;
	
	private short gladness;
	
	private int company;
	
	public ComplainPO() {
		super();
	}

	public ComplainPO(DecorationPO decoration, BrandPO brand,
			UserPO creater, UserPO updater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
		this.updater = updater;
	}

	@Id
	@GeneratedValue
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uuid", referencedColumnName = "uid")
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

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "gladness")
	public short getGladness() {
		return gladness;
	}

	public void setGladness(short gladness) {
		this.gladness = gladness;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
