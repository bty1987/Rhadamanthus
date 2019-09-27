package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class PointofsalesVO implements Serializable {

	private static final long serialVersionUID = 1447438476628722570L;

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

	private UserVO creater;

	private String rstcode;

	private String rstmsg;

	private String way;

	public PointofsalesVO() {
		super();
	}

	public PointofsalesVO(UserVO creater) {
		super();
		this.creater = creater;
	}

	public long getPosid() {
		return posid;
	}

	public void setPosid(long posid) {
		this.posid = posid;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	public String getMsgId() {
		return msgId;
	}

	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}

	public String getOutOrderNo() {
		return outOrderNo;
	}

	public void setOutOrderNo(String outOrderNo) {
		this.outOrderNo = outOrderNo;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public String getRstcode() {
		return rstcode;
	}

	public void setRstcode(String rstcode) {
		this.rstcode = rstcode;
	}

	public String getRstmsg() {
		return rstmsg;
	}

	public void setRstmsg(String rstmsg) {
		this.rstmsg = rstmsg;
	}

	public String getWay() {
		return way;
	}

	public void setWay(String way) {
		this.way = way;
	}

}
