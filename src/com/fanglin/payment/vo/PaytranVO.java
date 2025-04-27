package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class PaytranVO implements Serializable {

	private static final long serialVersionUID = 1447438476628722570L;

	private Long ptid;

	private String orderId;

	private Long pid;

	private Long rid;

	private Short type;

	private Short atttype;

	private Long ctid;

	private String no;

	private String sn;

	private String msgId;

	private String outOrderNo;

	private Short status;

	private Long money;

	private Timestamp createTime;

	private Timestamp pushTime;

	private UserVO creater;

	private String rstcode;

	private String rstmsg;

	private Short way;

	private String bompany;

	public PaytranVO() {
		super();
	}

	public PaytranVO(Long ptid) {
		super();
		this.ptid = ptid;
	}

	public PaytranVO(UserVO creater) {
		super();
		this.creater = creater;
	}

	public Long getPtid() {
		return ptid;
	}

	public void setPtid(Long ptid) {
		this.ptid = ptid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Long getCtid() {
		return ctid;
	}

	public void setCtid(Long ctid) {
		this.ctid = ctid;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getPushTime() {
		return pushTime;
	}

	public void setPushTime(Timestamp pushTime) {
		this.pushTime = pushTime;
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

	public Short getWay() {
		return way;
	}

	public void setWay(Short way) {
		this.way = way;
	}

	public String getBompany() {
		return bompany;
	}

	public void setBompany(String bompany) {
		this.bompany = bompany;
	}

}
