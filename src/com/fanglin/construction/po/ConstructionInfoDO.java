package com.fanglin.construction.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;

@Entity
@Table(name = "ConstructIoninfo", catalog = "construction")
public class ConstructionInfoDO implements Serializable{

	private static final long serialVersionUID = 3632587128968159874L;

	public static final String COLUMN_KEYTIME_STR = "keyTime";

	public static final String COLUMN_DRAWLINETIME_STR = "drawlineTime";
	
	public static final String COLUMN_FINISHTIME_STR = "finishTime";

	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final short COLUMN_ALREADY_SHORT = 0;
	
	public static final short COLUMN_STAY_SHORT = 1;

	private long ciid;

	private long cid;

	private DecorationPO decoration;
	
	private int timeLimit;

	private short ishovel;

	private short iskey;

	private short isCeremony;
	
	private short isConfirmPricture;
	
	private Timestamp finishTime;
	
	private Timestamp keyTime;
	
	private Timestamp drawlineTime;

	private String comment;

	public ConstructionInfoDO() {
		super();
	}
	
	public ConstructionInfoDO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}

	public ConstructionInfoDO(long cid, short ishovel, short iskey, short isCeremony, String comment, DecorationPO decoration) {
		super();
		this.cid = cid;
		this.ishovel = ishovel;
		this.iskey = iskey;
		this.isCeremony = isCeremony;
		this.decoration = decoration;
		this.comment = comment;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ciid")
	public long getCiid() {
		return ciid;
	}

	public void setCiid(long ciid) {
		this.ciid = ciid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName="orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "timeLimit")
	public int getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(int timeLimit) {
		this.timeLimit = timeLimit;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "ishovel")
	public short getIshovel() {
		return ishovel;
	}

	@Column(name = "ishovel")
	public void setIshovel(short ishovel) {
		this.ishovel = ishovel;
	}

	@Column(name = "iskey")
	public short getIskey() {
		return iskey;
	}

	public void setIskey(short iskey) {
		this.iskey = iskey;
	}

	@Column(name = "isCeremony")
	public short getIsCeremony() {
		return isCeremony;
	}

	public void setIsCeremony(short isCeremony) {
		this.isCeremony = isCeremony;
	}

	@Column(name = "isConfirmPricture")
	public short getIsConfirmPricture() {
		return isConfirmPricture;
	}

	public void setIsConfirmPricture(short isConfirmPricture) {
		this.isConfirmPricture = isConfirmPricture;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "keyTime")
	public Timestamp getKeyTime() {
		return keyTime;
	}

	public void setKeyTime(Timestamp keyTime) {
		this.keyTime = keyTime;
	}
	
	@Column(name = "drawlineTime")
	public Timestamp getDrawlineTime() {
		return drawlineTime;
	}

	public void setDrawlineTime(Timestamp drawlineTime) {
		this.drawlineTime = drawlineTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
