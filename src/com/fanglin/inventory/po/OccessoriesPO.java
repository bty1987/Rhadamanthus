package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
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
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "occessories", catalog = "inventory")
public class OccessoriesPO implements Serializable {

	private static final long serialVersionUID = 7990398717523266950L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_CREATER_USERID_STR = "creater.userId";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_DELIVETIME_STR = "deliveTime";

	public static final String COLUMN_RECRIVETIME_STR = "receiveTime";

	public static final String COLUMN_BALANCETIME_STR = "balanceTime";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_NO_STR = "no";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_BIND_INT = 1;

	public static final short STATUS_DELIVE_INT = 2;

	public static final short STATUS_RECEIVE_INT = 3;

	public static final short STATUS_BALANCE_INT = 4;

	public static final short STATUS_FINISH_INT = 5;

	public static final short ISEXCEED_EXCEED_INT = 0;

	private long oid;

	private String no;

	private DecorationPO decoration;

	private UserPO creater;

	private UserPO supervisor;

	private UserPO supplier; // 厂商

	private UserPO balancer;// 结算人

	private UserPO deliver;// 配送人

	private UserPO receiver;// 接收人

	private Timestamp createTime; // 创建时间

	private Timestamp deliveTime; // 配送时间

	private Timestamp receiveTime; // 接收时间

	private Timestamp balanceTime;// 结算时间

	private Timestamp finishTime;// 完成时间

	private long total;

	private int rbalance; // 实结算额

	private int vbalance; // 虚结算额

	private long charge; // 外辅费用总额

	private long rcharge; // 结算费用

	private short isEnter;// 是否可进园区

	private short isLift;// 是否有电梯

	private short isExceed;// 是否超阶

	private short isAttic;// 是否有阁楼

	private short loadFloor;// 上料楼层

	private short status;

	private int company; // 公司

	private String comment; // 备注

	private String content; // 说明

	private int rate; // 评分

	private String remake; // 评价

	public OccessoriesPO() {
		super();
	}

	public OccessoriesPO(Long oid) {
		super();
		setOid(oid);
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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
	@JoinColumn(name = "svuid", referencedColumnName = "uid")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "deuid", referencedColumnName = "uid")
	public UserPO getDeliver() {
		return deliver;
	}

	public void setDeliver(UserPO deliver) {
		this.deliver = deliver;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "reuid", referencedColumnName = "uid")
	public UserPO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserPO receiver) {
		this.receiver = receiver;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "spuid", referencedColumnName = "uid")
	public UserPO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserPO supplier) {
		this.supplier = supplier;
	}

	@Column(name = "deliveTime")
	public Timestamp getDeliveTime() {
		return deliveTime;
	}

	public void setDeliveTime(Timestamp deliveTime) {
		this.deliveTime = deliveTime;
	}

	@Column(name = "receiveTime")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "rbalance")
	public int getRbalance() {
		return rbalance;
	}

	public void setRbalance(int rbalance) {
		this.rbalance = rbalance;
	}

	@Column(name = "vbalance")
	public int getVbalance() {
		return vbalance;
	}

	public void setVbalance(int vbalance) {
		this.vbalance = vbalance;
	}

	@Column(name = "charge")
	public long getCharge() {
		return charge;
	}

	public void setCharge(long charge) {
		this.charge = charge;
	}

	@Column(name = "rcharge")
	public long getRcharge() {
		return rcharge;
	}

	public void setRcharge(long rcharge) {
		this.rcharge = rcharge;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "buid", referencedColumnName = "uid")
	public UserPO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserPO balancer) {
		this.balancer = balancer;
	}

	@Column(name = "isEnter")
	public short getIsEnter() {
		return isEnter;
	}

	public void setIsEnter(short isEnter) {
		this.isEnter = isEnter;
	}

	@Column(name = "isLift")
	public short getIsLift() {
		return isLift;
	}

	public void setIsLift(short isLift) {
		this.isLift = isLift;
	}

	@Column(name = "isExceed")
	public short getIsExceed() {
		return isExceed;
	}

	public void setIsExceed(short isExceed) {
		this.isExceed = isExceed;
	}

	@Column(name = "isAttic")
	public short getIsAttic() {
		return isAttic;
	}

	public void setIsAttic(short isAttic) {
		this.isAttic = isAttic;
	}

	@Column(name = "loadFloor")
	public short getLoadFloor() {
		return loadFloor;
	}

	public void setLoadFloor(short loadFloor) {
		this.loadFloor = loadFloor;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	@Column(name = "remake")
	public String getRemake() {
		return remake;
	}

	public void setRemake(String remake) {
		this.remake = remake;
	}

	public OccessoriesPO init(String no, String orderId, UserPO creater, int company, short isEnter, short isLift, short isExceed, short isAttic, short loadFloor) {

		setNo(no);
		setCreater(creater);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		setStatus(OccessoriesPO.STATUS_INIT_INT);
		setCompany(company);
		setIsEnter(isEnter);
		setIsLift(isLift);
		setIsExceed(isExceed);
		setIsAttic(isAttic);
		setLoadFloor(loadFloor);

		return this;
	}

	public OccessoriesVO ptv(OccessoriesVO occessoriesVO) {

		BeanUtil.copyProperties(this, occessoriesVO, Arrays.asList("decoration", "creater", "supervisor", "supplier", "deliver", "receiver", "balancer"));

		if (occessoriesVO.getCreater() != null && getCreater() != null) occessoriesVO.getCreater().setBaseInfo(getCreater());
		if (occessoriesVO.getSupervisor() != null && getSupervisor() != null) occessoriesVO.getSupervisor().setBaseInfo(getSupervisor());

		if (occessoriesVO.getSupplier() != null && getSupplier() != null) occessoriesVO.getSupplier().setBaseInfo(getSupplier());

		if (occessoriesVO.getDecoration() != null && getDecoration() != null) getDecoration().ptvcascade(occessoriesVO.getDecoration());

		return occessoriesVO;
	}

}
