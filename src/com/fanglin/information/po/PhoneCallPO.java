package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "phonecall", catalog = "information")
public class PhoneCallPO implements java.io.Serializable {

	private static final long serialVersionUID = 1485512158675803577L;

	public static final String PHONECALLPO_PHONECALLBACK_STR = "%s/phoneCallback.do?phoneCallback.caller=%s&phoneCallback.callee=%s&phoneCallback.pcid=%s";

	public static final int PHONECALLPO_STOPREASON_STR = 0;

	public static final int STOPREASON_CALLER_INT = 1; // 主叫挂断

	public static final int STOPREASON_CALLED_INT = 2; // 被叫挂断

	public static final int STOPREASON_CALL_INT = 3; // 呼叫不可及

	public static final int STOPREASON_MISSED_INT = 5; // 超时未接

	public static final int STOPREASON_OVERTIME_INT = 6; // 拒接或超时

	public static final int STOPREASON_NETWORK_INT = 7; // 网络问题

	public static final int STOPREASON_REQUEST_INT = 9; // API请求挂断

	public static final int STOPREASON_INSUFFICIENT_INT = 10; // 余额不足

	public static final int STOPREASON_ERROR_INT = 11; // 呼叫失败，系统错误

	public static final int STOPREASON_REFUSE_INT = 12; // 被叫拒接

	public static final int STOPREASON_NOANSWER_INT = 13; // 被叫无人接听

	public static final int STOPREASON_BUSY_INT = 14; // 被叫正忙

	public static final int STOPREASON_NOTONLINE_INT = 15; // 被叫不在线

	public static final int STOPREASON_MAXIMUM_INT = 16; // 呼叫超过最大呼叫时间

	private long pcid;

	private String orderId;

	private UserPO operater;

	private Timestamp operateTime;

	private String callbackId;

	private String caller;

	private String callee;

	private long startTime;

	private long endTime;

	private int stopReason;

	private int duration;

	public PhoneCallPO() {
		super();
	}

	public PhoneCallPO(UserPO operater) {
		super();
		this.operater = operater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pcid")
	public long getPcid() {
		return pcid;
	}

	public void setPcid(long pcid) {
		this.pcid = pcid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid", nullable = false)
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "callbackId")
	public String getCallbackId() {
		return callbackId;
	}

	public void setCallbackId(String callbackId) {
		this.callbackId = callbackId;
	}

	@Column(name = "caller")
	public String getCaller() {
		return caller;
	}

	public void setCaller(String caller) {
		this.caller = caller;
	}

	@Column(name = "callee")
	public String getCallee() {
		return callee;
	}

	public void setCallee(String callee) {
		this.callee = callee;
	}

	@Column(name = "startTime")
	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public long getEndTime() {
		return endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	@Column(name = "stopReason")
	public int getStopReason() {
		return stopReason;
	}

	public void setStopReason(int stopReason) {
		this.stopReason = stopReason;
	}

	@Column(name = "duration")
	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

}
