package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.ReceiptTypePO;

@Entity
@Table(name = "custype", catalog = "data")
public class CustypePO implements java.io.Serializable {

	private static final long serialVersionUID = -6973544575584118587L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_DGRADE_STR = "dgrade";

	public static final String COLUMN_SGRADE_STR = "sgrade";

	public static final String COLUMN_ATTTYPE_STR = "atttype";

	public static final String COLUMN_PLATFORM_STR = "platform";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_AGENT_STR = "agent";

	public static final String COLUMN_PHONE_STR = "phone";

	public static final String COLUMN_WXAPP_STR = "wxapp";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short ATTTYPE_ADVANCE_INT = 0;

	public static final short ATTTYPE_DECORATION_INT = 1;

	public static final short ATTTYPE_MATERIAL_INT = 2;

	public static final short ATTTYPE_SALES_INT = 3;

	public static final short ATTTYPE_SERVICE_INT = 4;

	public static final short PLATFORM_POSPAY_INT = 0;

	public static final short PLATFORM_WXPAY_INT = 1;

	private long ctid;

	private String name; // 名称

	private String no; // 商户号

	private String agent; // 机构号

	private String phone; // 商户手机号

	private String wxapp; // wx小程序appid

	private ReceiptTypePO receiptType;

	private short platform; // 支付方式 0：pos 1: wxpay

	private short atttype; // 业务类型: 0预付 , 1装修 , 2主材/占位 , 3销售 , 4服务

	private String dgrade; // 装修单等级: A/B/C

	private String sgrade; // 销售单等级: A/B/C

	private short status; // 0:启用 1:禁用

	private int company; // 公司

	public CustypePO() {
		super();
	}

	public CustypePO(ReceiptTypePO receiptType) {
		super();
		this.receiptType = receiptType;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ctid")
	public long getCtid() {
		return ctid;
	}

	public void setCtid(long ctid) {
		this.ctid = ctid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "agent")
	public String getAgent() {
		return agent;
	}

	public void setAgent(String agent) {
		this.agent = agent;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "wxapp")
	public String getWxapp() {
		return wxapp;
	}

	public void setWxapp(String wxapp) {
		this.wxapp = wxapp;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rtid", referencedColumnName = "rtid")
	public ReceiptTypePO getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(ReceiptTypePO receiptType) {
		this.receiptType = receiptType;
	}

	@Column(name = "platform")
	public short getPlatform() {
		return platform;
	}

	public void setPlatform(short platform) {
		this.platform = platform;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "dgrade")
	public String getDgrade() {
		return dgrade;
	}

	public void setDgrade(String dgrade) {
		this.dgrade = dgrade;
	}

	@Column(name = "sgrade")
	public String getSgrade() {
		return sgrade;
	}

	public void setSgrade(String sgrade) {
		this.sgrade = sgrade;
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

}