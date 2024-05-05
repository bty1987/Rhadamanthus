package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;

@Entity
@Table(name = "droup", catalog = "customer")
public class DroupPO implements Serializable {

	private static final long serialVersionUID = 8274003624759241751L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_CHATID_STR = "chatId";

	public static final String COLUMN_OPENID_STR = "openId";

	public static final String COLUMN_CUSTOMER_STR = "customer.name";

	public static final short ISHANDLE_RESP_INT = 1;

	public static final short ISHANDLE_REQU_INT = 0;

	public static final short ISREAD_RESP_INT = 1;

	public static final short TYPE_DINGTALK_INT = 1;

	public static final short TYPE_WECHAT_INT = 2;

	private long did;

	private String name;

	private DecorationPO decoration;

	private String chatId;

	private String openId;

	private short type; // 1:钉钉 2:微信

	private short status;

	private short isHandle;

	private short isRead;

	private Timestamp updateTime;

	private Timestamp handleTime;

	private int company;

	public DroupPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "did")
	public long getDid() {
		return did;
	}

	public void setDid(long did) {
		this.did = did;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "chatId")
	public String getChatId() {
		return chatId;
	}

	public void setChatId(String chatId) {
		this.chatId = chatId;
	}

	@Column(name = "openId")
	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "isHandle")
	public short getIsHandle() {
		return isHandle;
	}

	public void setIsHandle(short isHandle) {
		this.isHandle = isHandle;
	}

	@Column(name = "isRead")
	public short getIsRead() {
		return isRead;
	}

	public void setIsRead(short isRead) {
		this.isRead = isRead;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "handleTime")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
