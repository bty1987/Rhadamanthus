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
@Table(name = "paytran", catalog = "payment")
public class PaytranPO implements java.io.Serializable {

	private static final long serialVersionUID = 7824990482786583843L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_PID_STR = "pid";

	public static final String COLUMN_RID_STR = "rid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_ATTTYPE_STR = "atttype";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_CUSERID_STR = "creater.userId";

	public static final String COLUMN_SN_STR = "sn";

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_SUCCESS_INT = 1; // 成功

	public static final short STATUS_FAIL_INT = 2; // 失败

	public static final short STATUS_INVALID_INT = 3; // 失效

	public static final short STATUS_USED_INT = 4; // 已用

	public static final short TYPE_ADVANCE_INT = 0; // 预付款

	public static final short TYPE_DECORATION_INT = 1; // 装修款

	public static final short TYPE_MATERIAL_INT = 2; // 主材款

	public static final short TYPE_SALES_INT = 3; // 销售款

	public static final short TYPE_SERVICE_INT = 4; // 服务款

	public static final short TYPE_ACTIVITY_INT = 5; // 活动款

	public static final short TYPE_PAYTRAN_INT = 6; // 转换款

	public static final short TYPE_PROXY_INT = 7; // 代付款

	public static final short ATTTYPE_DECORATION_INT = 0; // 装修

	public static final short ATTTYPE_MATERIAL_INT = 1; // 主材

	public static final short WAY_ACQUIRE_SHORT = 0; // pos机

	public static final short WAY_WXPAY_SHORT = 1; // 微信小程序

	public static final short WAY_ALIPAY_SHORT = 2; // 支付宝

	public static final short WAY_CODEPAY_SHORT = 3; // pos扫码

	public static final long CHECK_INVALIDTIME_LONG = 120000; // 失效时长2m

	public static final short CODESTATUS_PAY_SHORT = 0;

	public static final short CODESTATUS_UNPAYING_SHORT = 1;

	private long ptid;

	private String orderId;

	private long pid;

	private long rid;

	private short type;

	private short atttype; // 0:装修 1:主材

	private long ctid;

	private String no;

	private String sn;

	private String msgId;

	private String outOrderNo;

	private short status;

	private long money;

	private Timestamp createTime;

	private Timestamp pushTime;

	private UserPO creater;

	private String rstcode;

	private String rstmsg;

	private short way;

	public PaytranPO() {
		super();
	}

	public PaytranPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	public PaytranPO(String orderId, long pid, short type, short atttype, String no, short status, long money, short way) {
		super();
		this.orderId = orderId;
		this.pid = pid;
		this.type = type;
		this.atttype = atttype;
		this.no = no;
		this.status = status;
		this.money = money;
		this.way = way;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ptid")
	public long getPtid() {
		return ptid;
	}

	public void setPtid(long ptid) {
		this.ptid = ptid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "ctid")
	public long getCtid() {
		return ctid;
	}

	public void setCtid(long ctid) {
		this.ctid = ctid;
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

	@Column(name = "pushTime")
	public Timestamp getPushTime() {
		return pushTime;
	}

	public void setPushTime(Timestamp pushTime) {
		this.pushTime = pushTime;
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

	@Column(name = "way")
	public short getWay() {
		return way;
	}

	public void setWay(short way) {
		this.way = way;
	}

}