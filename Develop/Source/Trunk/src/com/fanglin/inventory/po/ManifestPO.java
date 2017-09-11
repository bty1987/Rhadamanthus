package com.fanglin.inventory.po;

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
@Table(name = "manifest", catalog = "inventory")
public class ManifestPO implements java.io.Serializable {

	private static final long serialVersionUID = -993315610358345746L;
	
	public static final String COLUMN_COMPANY_STR ="company";
	
	public static final String COLUMN_MID_STR = "mid";
	
	public static final String COLUMN_CODE_STR = "code";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_MANIFESTTIME_STR = "manifestTime";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final Float COLUMN_TOTAL_STR = 0F;
	
	public static final Short TYPE_CR_INT = 2;
	
	public static final Short TYPE_XB_INT = 4;
	
	public static final Short COLUMN_TYPE_STR = 6;
	
	public static final Short TYPE_PM_INT = 8;
	
	public static final Short TYPE_PS_INT = 9;
	
	public static final int COLUMN_CUSTOMERID_STR = 0;
	
	public static final Short COLUMN_CONFIRMEDSTATUS_STR = 1;
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;	
	
	private long mid;
	
	private int company;
	
	private String code;
	
	private Timestamp createTime;
	
	private Timestamp manifestTime;
	
	private UserPO createUser;
	
	private float total;
	
	private short type;
	
	private short status;
	
	private String comment;
	
	private String attachment;
	
	private ManifestPO quoteManifest;
	
	public ManifestPO() {
		super();
	}

	public ManifestPO(String code) {
		super();
		this.code = code;
	}

	public ManifestPO(long mid) {
		super();
		this.mid = mid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mId")
	public long getMid() {
		return this.mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "code")
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "manifestTime")
	public Timestamp getManifestTime() {
		return this.manifestTime;
	}

	public void setManifestTime(Timestamp manifestTime) {
		this.manifestTime = manifestTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createUserId", referencedColumnName = "uId")
	public UserPO getCreateUser() {
		return createUser;
	}

	public void setCreateUser(UserPO createUser) {
		this.createUser = createUser;
	}

	@Column(name = "total")
	public float getTotal() {
		return this.total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "attachment")
	public String getAttachment() {
		return this.attachment;
	}

	public void setAttachment(String attachment) {
		this.attachment = attachment;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qmid", referencedColumnName = "mid")
	public ManifestPO getQuoteManifest() {
		return quoteManifest;
	}

	public void setQuoteManifest(ManifestPO quoteManifest) {
		this.quoteManifest = quoteManifest;
	}

}