package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "feedback", catalog = "customer")
public class FeedbackPO implements Serializable {

	private static final long serialVersionUID = -4913298852355057877L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_PHONE_STR = "phone";

	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_HANDLETIME_STR = "handleTime";	
	
	public static final String COLUMN_RECEIVETIME_STR = "receiveTime";
	
	public static final String COLUMN_HANDLER_STR = "handler.userId";
	
	public static final String COLUMN_RECEIVER_STR = "receiver.userId";

	public static final Short STATUS_INITIAL_INT = 0;

	public static final Short STATUS_RECEIVE_INT = 1;

	public static final Short STATUS_HANDLE_INT = 2;

	public static final Short STATUS_FINISH_INT = 3;

	private long fid;

	private String unionId;

	private String content;

	private Timestamp createTime;

	private short type;

	private String picture;

	private String orderId;

	private String phone;

	private UserPO receiver;

	private UserPO finisher;

	private UserPO handler;

	private Timestamp receiveTime;

	private Timestamp handleTime;

	private Timestamp finishTime;

	private short status;

	private CompanyPO company;

	@Id
	@GeneratedValue
	@Column(name = "fid")
	public long getFid() {
		return fid;
	}

	public void setFid(long fid) {
		this.fid = fid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "picture")
	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ruid", referencedColumnName = "uid")
	public UserPO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserPO receiver) {
		this.receiver = receiver;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "huid", referencedColumnName = "uid")
	public UserPO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserPO finisher) {
		this.finisher = finisher;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "fuid", referencedColumnName = "uid")
	public UserPO getHandler() {
		return handler;
	}

	public void setHandler(UserPO handler) {
		this.handler = handler;
	}

	@Column(name = "receiveTime")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	@Column(name = "handleTime")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne
	@JoinColumn(name = "company", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	public FeedbackVO ptv(FeedbackVO feedbackVO) {

		BeanUtil.copyPropertie(this, feedbackVO, Arrays.asList("company", "receiver", "finisher", "handler"));

		if (feedbackVO.getReceiver() != null && getReceiver() != null) feedbackVO.getReceiver().ptv(getReceiver());
		if (feedbackVO.getHandler() != null && getHandler() != null) feedbackVO.getHandler().ptv(getHandler());
		if (feedbackVO.getFinisher() != null && getFinisher() != null) feedbackVO.getFinisher().ptv(getFinisher());

		feedbackVO.setCompany(getCompany().getName());

		return feedbackVO;
	}

}
