package com.fanglin.construction.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "ConstructIoninfo", catalog = "construction")
public class ConstructionInfoPO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;

	public static final String COLUMN_CIID_STR = "ciid";

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short COLUMN_ALREADY_SHORT = 0;

	public static final short COLUMN_STAY_SHORT = 1;

	public static final short ISISSUE_ISSUE_INT = 1;

	public static final short ISCHECK_CHECK_INT = 1;

	private long ciid;

	private long cid;

	private String orderId;

	private int timeLimit;

	private int designPeriod;

	private int designOverdueDays;

	private Timestamp initDesignTime;

	private Timestamp issueTime;

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

	private long actuaTime;

	private String comment;

	private short handoverStatus;

	public ConstructionInfoPO() {
		super();
	}

	public ConstructionInfoPO(long cid, short ishovel, short iskey, short isCeremony, String comment, String orderId) {

		super();

		this.cid = cid;
		this.ishovel = ishovel;
		this.iskey = iskey;
		this.isCeremony = isCeremony;
		this.comment = comment;
		this.orderId = orderId;
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

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
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

	@Column(name = "initDesignTime")
	public Timestamp getInitDesignTime() {
		return initDesignTime;
	}

	public void setInitDesignTime(Timestamp initDesignTime) {
		this.initDesignTime = initDesignTime;
	}

	@Column(name = "issueTime")
	public Timestamp getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Timestamp issueTime) {
		this.issueTime = issueTime;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	@Column(name = "actuaTime")
	public long getActuaTime() {
		return actuaTime;
	}

	public void setActuaTime(long actuaTime) {
		this.actuaTime = actuaTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "handoverStatus")
	public short getHandoverStatus() {
		return handoverStatus;
	}

	public void setHandoverStatus(short handoverStatus) {
		this.handoverStatus = handoverStatus;
	}

	public ConstructionInfoVO ptv(ConstructionInfoVO constructionInfoVO) {

		BeanUtil.copyProperties(this, constructionInfoVO, "");

		return constructionInfoVO;
	}

}
