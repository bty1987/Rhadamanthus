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

import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "ConstructIoninfo", catalog = "construction")
public class ConstructionInfoDO implements Serializable {

	private static final long serialVersionUID = 3632587128968159874L;

	public static final String COLUMN_KEYTIME_STR = "keyTime";

	public static final String COLUMN_DRAWLINETIME_STR = "drawlineTime";

	public static final String COLUMN_FINISHTIME_STR = "finishTime";

	public static final String COLUMN_DESIGNTIME_STR = "designTime";

	public static final String COLUMN_SDESIGNTIME_STR = "decoration.sdesignTime";

	public static final String COLUMN_EDESIGNTIME_STR = "decoration.edesignTime";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short COLUMN_ALREADY_SHORT = 0;

	public static final short COLUMN_STAY_SHORT = 1;

	private long ciid;

	private long cid;

	private DecorationPO decoration;

	private int timeLimit;

	private int designPeriod;

	private int designOverdueDays;

	private short ishovel;

	private short iskey;

	private short isCeremony;

	private short isIssue;

	private short isCheck;

	private Timestamp finishTime;

	private Timestamp keyTime;

	private Timestamp drawlineTime;

	private Timestamp designTime;

	private Timestamp checkTime;

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
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
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

	@Column(name = "designPeriod")
	public int getDesignPeriod() {
		return designPeriod;
	}

	public void setDesignPeriod(int designPeriod) {
		this.designPeriod = designPeriod;
	}

	@Column(name = "designOverdueDays")
	public int getDesignOverdueDays() {
		return designOverdueDays;
	}

	public void setDesignOverdueDays(int designOverdueDays) {
		this.designOverdueDays = designOverdueDays;
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

	@Column(name = "isIssue")
	public short getIsIssue() {
		return isIssue;
	}

	public void setIsIssue(short isIssue) {
		this.isIssue = isIssue;
	}

	@Column(name = "isCheck")
	public short getIsCheck() {
		return isCheck;
	}

	public void setIsCheck(short isCheck) {
		this.isCheck = isCheck;
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

	@Column(name = "designTime")
	public Timestamp getDesignTime() {
		return designTime;
	}

	public void setDesignTime(Timestamp designTime) {
		this.designTime = designTime;
	}

	@Column(name = "checkTime")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public ConstructionInfoVO ptv(ConstructionInfoVO constructionInfoVO) {

		BeanUtil.copyProperties(this, constructionInfoVO, "decoration");

		if (constructionInfoVO.getDecoration() != null && getDecoration() != null) getDecoration().ptvcascade(constructionInfoVO.getDecoration());

		return constructionInfoVO;
	}

}
