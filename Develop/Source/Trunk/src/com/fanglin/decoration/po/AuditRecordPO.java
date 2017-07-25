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
@Table(name = "auditRecord", catalog = "platform")
public class AuditRecordPO implements Serializable{

	private static final long serialVersionUID = -5288629146839850025L;
	
	public static final String COLUMN_AID_STR = "aid";
	
	public static final String COLUMN_ARIF_LONG = "arid";
	
	public static final int STATUS_INIT_SHORT = 0;
	
	public static final int STATUS_NOTINIT_SHORT = 1;
	
	private long arid;
	
	private long aid;
	
	private String comment;
	
	private float unitprice;
	
	private float num;
	
	private float discount;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private int status;

	public AuditRecordPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="arid")
	public long getArid() {
		return arid;
	}

	public void setArid(long arid) {
		this.arid = arid;
	}
	
	@Column(name="aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name="unitprice")
	public float getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(float unitprice) {
		this.unitprice = unitprice;
	}

	@Column(name="num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name="discount")
	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid",referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	
	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@Column(name="status")
	public int getStatus() {
		return status;
	}


}
