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

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "aepair", catalog = "customer")
public class AepairPO implements Serializable {

	private static final long serialVersionUID = 630431659771884928L;

	public static final String COLUMN_ORDERID_STR = "decoration.orderId";

	public static final String COLUMN_CREATER_USERID_STR = "creater.userId";

	public static final String COLUMN_UPDATE_USERID_STR = "updater.userId";

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_REPAIR_INT = 1; // 维修

	public static final short STATUS_FINISH_INT = 2; // 完工

	public static final short STATUS_CLOSE_INT = 3; // 关闭

	public static final short ONESTATE_SHUI_INT = 1; // 水

	public static final short TWOSTATE_DIAN_INT = 2; // 电

	public static final short THRSTATE_WA_INT = 3; // 瓦

	public static final short FORSTATE_MU_INT = 4; // 木

	public static final short FIVSTATE_YOU_INT = 5; // 油

	public static final String COLUMN_STATUS_STR = "status";

	private long aid;

	private long csid;

	private DecorationPO decoration;

	private UserPO creater;

	private UserPO updater;

	private UserPO repaier;

	private Timestamp createTime;

	private Timestamp targetTime;

	private Timestamp updateTime;

	private Timestamp finishTime;

	private short onestate;

	private short twostate;

	private short thrstate;

	private short forstate;

	private short fivstate;

	private short status;

	private long outlay;

	private long outpay;

	private short gladness;

	private int company;

	private String comment;

	public AepairPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ruid", referencedColumnName = "uid")
	public UserPO getRepaier() {
		return repaier;
	}

	public void setRepaier(UserPO repaier) {
		this.repaier = repaier;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "targetTime")
	public Timestamp getTargetTime() {
		return targetTime;
	}

	public void setTargetTime(Timestamp targetTime) {
		this.targetTime = targetTime;
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

	@Column(name = "onestate")
	public short getOnestate() {
		return onestate;
	}

	public void setOnestate(short onestate) {
		this.onestate = onestate;
	}

	@Column(name = "twostate")
	public short getTwostate() {
		return twostate;
	}

	public void setTwostate(short twostate) {
		this.twostate = twostate;
	}

	@Column(name = "thrstate")
	public short getThrstate() {
		return thrstate;
	}

	public void setThrstate(short thrstate) {
		this.thrstate = thrstate;
	}

	@Column(name = "forstate")
	public short getForstate() {
		return forstate;
	}

	public void setForstate(short forstate) {
		this.forstate = forstate;
	}

	@Column(name = "fivstate")
	public short getFivstate() {
		return fivstate;
	}

	public void setFivstate(short fivstate) {
		this.fivstate = fivstate;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "outlay")
	public long getOutlay() {
		return outlay;
	}

	public void setOutlay(long outlay) {
		this.outlay = outlay;
	}

	@Column(name = "outpay")
	public long getOutpay() {
		return outpay;
	}

	public void setOutpay(long outpay) {
		this.outpay = outpay;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public AepairPO init(long csid, DecorationPO decoration, UserPO creater, Timestamp targetTime, int company, String comment) {

		this.setCsid(csid);
		this.setDecoration(decoration);
		this.setTargetTime(targetTime);
		this.setCreater(creater);
		this.setUpdater(creater);
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setStatus(STATUS_INIT_INT);
		this.setCompany(company);
		this.setComment(comment);

		return this;
	}

}
