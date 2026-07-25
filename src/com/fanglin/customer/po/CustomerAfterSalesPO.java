package com.fanglin.customer.po;

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

import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.vo.CustomerAfterSalesVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "customeraftersales", catalog = "customer")
public class CustomerAfterSalesPO implements Serializable {

	private static final long serialVersionUID = 8526532966982496882L;

	public static final String COLUMN_ASNO_STR = "asNo";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_CSID_STR = "csid";

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_SOURCE_STR = "source";

	public static final String COLUMN_PRIORITY_STR = "priority";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_OWNER_USERID_STR = "owner.userId";

	public static final String COLUMN_CREATER_USERID_STR = "creater.userId";

	public static final short TYPE_FEEDBACK_INT = 0;

	public static final short TYPE_COMPLAINT_INT = 1;

	public static final short TYPE_AEPAIR_INT = 2;

	public static final short TYPE_REPAIR_INT = 3;

	public static final short TYPE_ADVICE_INT = 4;

	public static final short TYPE_PRAISE_INT = 5;

	public static final short TYPE_REFUND_INT = 6;

	public static final short SOURCE_MANUAL_INT = 0;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_RECEIVE_INT = 1;

	public static final short STATUS_DISPATCH_INT = 2;

	public static final short STATUS_HANDLE_INT = 3;

	public static final short STATUS_CONFIRM_INT = 4;

	public static final short STATUS_FINISH_INT = 5;

	public static final short STATUS_CLOSE_INT = 6;

	public static final short STATUS_CANCEL_INT = 7;

	public static final short STATUS_HOLD_INT = 8;

	public static final short STATUS_UPGRADE_INT = 9;

	public static final short STATUS_REOPEN_INT = 10;

	private long asid;

	private String asNo;

	private short type;

	private short source;

	private String orderId;

	private long csid;

	private long cid;

	private String contactName;

	private String phone;

	private String content;

	private short priority;

	private short status;

	private UserPO owner;

	private int did;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Timestamp receiveTime;

	private Timestamp handleTime;

	private Timestamp finishTime;

	private Timestamp closeTime;

	private Timestamp responseDeadline;

	private Timestamp finishDeadline;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "asid")
	public long getAsid() {
		return asid;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}

	@Column(name = "asNo")
	public String getAsNo() {
		return asNo;
	}

	public void setAsNo(String asNo) {
		this.asNo = asNo;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "source")
	public short getSource() {
		return source;
	}

	public void setSource(short source) {
		this.source = source;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "contactName")
	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "priority")
	public short getPriority() {
		return priority;
	}

	public void setPriority(short priority) {
		this.priority = priority;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ouid", referencedColumnName = "uId")
	public UserPO getOwner() {
		return owner;
	}

	public void setOwner(UserPO owner) {
		this.owner = owner;
	}

	@Column(name = "did")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
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

	@Column(name = "closeTime")
	public Timestamp getCloseTime() {
		return closeTime;
	}

	public void setCloseTime(Timestamp closeTime) {
		this.closeTime = closeTime;
	}

	@Column(name = "responseDeadline")
	public Timestamp getResponseDeadline() {
		return responseDeadline;
	}

	public void setResponseDeadline(Timestamp responseDeadline) {
		this.responseDeadline = responseDeadline;
	}

	@Column(name = "finishDeadline")
	public Timestamp getFinishDeadline() {
		return finishDeadline;
	}

	public void setFinishDeadline(Timestamp finishDeadline) {
		this.finishDeadline = finishDeadline;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public CustomerAfterSalesPO init(String asNo, UserPO creater, int company) {

		setAsNo(asNo);
		setCreater(creater);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		setStatus(STATUS_INIT_INT);
		setCompany(company);

		return this;
	}

	public CustomerAfterSalesVO ptv(CustomerAfterSalesVO customerAfterSalesVO) {

		BeanUtil.copyProperties(this, customerAfterSalesVO, Arrays.asList("creater", "owner"));

		customerAfterSalesVO.setPhone(SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(getPhone())));

		if (customerAfterSalesVO.getCreater() != null && getCreater() != null) customerAfterSalesVO.getCreater().setBaseInfo(getCreater());
		if (customerAfterSalesVO.getOwner() != null && getOwner() != null) customerAfterSalesVO.getOwner().setBaseInfo(getOwner());

		return customerAfterSalesVO;
	}

}
