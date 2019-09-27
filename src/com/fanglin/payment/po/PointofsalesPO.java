package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "pointofsales", catalog = "payment")
public class PointofsalesPO implements java.io.Serializable {

	private static final long serialVersionUID = 7824990482786583843L;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_SUCCESS_INT = 1; // 成功

	public static final short STATUS_FAIL_INT = 2; // 失败

	public static final short STATUS_INVALID_INT = 3; // 失效

	public static final short STATUS_USED_INT = 4;

	private long posid;

	private String pid;

	private short type;

	private String no;

	private String sn;

	private String msgId;

	private String outOrderNo;

	private short status;

	private long money;

	private Timestamp createTime;

	private UserPO creater;

	private String rstcode;

	private String rstmsg;

	public PointofsalesPO() {
		super();
	}

	public PointofsalesPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "posid")
	public long getPosid() {
		return posid;
	}

	public void setPosid(long posid) {
		this.posid = posid;
	}

	@Column(name = "pid")
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "sn")
	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	@Column(name = "msgId")
	public String getMsgId() {
		return msgId;
	}

	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}

	@Column(name = "outOrderNo")
	public String getOutOrderNo() {
		return outOrderNo;
	}

	public void setOutOrderNo(String outOrderNo) {
		this.outOrderNo = outOrderNo;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "rstcode")
	public String getRstcode() {
		return rstcode;
	}

	public void setRstcode(String rstcode) {
		this.rstcode = rstcode;
	}

	@Column(name = "rstmsg")
	public String getRstmsg() {
		return rstmsg;
	}

	public void setRstmsg(String rstmsg) {
		this.rstmsg = rstmsg;
	}

}