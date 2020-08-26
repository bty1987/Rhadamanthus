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
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "complaint", catalog = "customer")
public class ComplaintPO implements Serializable {
	
	private static final long serialVersionUID = 6339034334932620347L;
	
	public static final short TYPE_DESIGN_SHORT = 0;
	
	public static final short TYPE_BUSINESS_SHORT = 1;
	
	public static final short TYPE_CONSTRUCTION_SHORT = 2;
	
	public static final short TYPE_SALES_SHORT = 3;
	
	public static final short TYPE_UNREASONBLE_SHORT = 4;
	
	public static final short STATUS_INIT_SHORT = 0;
	
	public static final short STATUS_DISPOSE_SHORT = 1;
	
	public static final short STATUS_END_SHORT = 2;
	
	public static final short STATUS_CLOSE_SHORT = 3;
	
	public static final String COLUMN_CID_STR = "cid";

	private long ctid;
	
	private long cid;
		
	private short type;
	
	private DepartmentPO dept;
	
	private UserPO staff;
	
	private BrandPO brand;
	
	private String content;
	
	private UserPO creater;
	
	private UserPO updater;
	
	private Timestamp createTime;
	
	private Timestamp updateTime;
	
	private Timestamp finishTime;
	
	private short status;

	public ComplaintPO() {
		super();
	}

	public ComplaintPO(DepartmentPO dept, UserPO staff, BrandPO brand,
			UserPO creater, UserPO updater) {
		super();
		this.dept = dept;
		this.staff = staff;
		this.brand = brand;
		this.creater = creater;
		this.updater = updater;
	}

	@Id
	@GeneratedValue
	@Column(name = "ctid")
	public long getCtid() {
		return ctid;
	}

	public void setCtid(long ctid) {
		this.ctid = ctid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "dId")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getStaff() {
		return staff;
	}

	public void setStaff(UserPO staff) {
		this.staff = staff;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
