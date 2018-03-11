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
