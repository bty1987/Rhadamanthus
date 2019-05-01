package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "manifest", catalog = "inventory")
public class ManifestPO implements java.io.Serializable {

	private static final long serialVersionUID = -993315610358345746L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_MID_STR = "mid";

	public static final String COLUMN_CODE_STR = "code";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_MANIFESTTIME_STR = "manifestTime";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_CREATEUSER_USERID_STR = "creater.userId";
	
	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_CONFIRM_INT = 1;

	public static final short TYPE_CG_INT = 1; // 进货 CG  入库

	public static final short TYPE_CR_INT = 2; // 进退 CR  出库
	
	public static final short TYPE_XG_INT = 3; // 出货 XG  出库

	public static final short TYPE_XB_INT = 4; // 出返 XB  入库

	public static final short TYPE_DB_INT = 5; // 调拨 DB  入库/出库

	public static final short TYPE_PU_INT = 6; // 采购 PU  入库

	public static final short TYPE_AS_INT = 7; // 辅料 AS  出库
	
	public static final short TYPE_AR_INT = 8; // 辅退 AR  入库
	
	public static final short TYPE_PM_INT = 9; // 套合 PM  入库/出库

	public static final short TYPE_PS_INT = 10; // 套拆 PS  入库/出库
	
	public static final short TYPE_CP_INT = 11; // 盘盈 CP  入库
	
	public static final short TYPE_CL_INT = 12; // 盘亏 CL  出库

	private long mid;

	private String code;
	
	private UserPO creater;

	private Timestamp createTime;

	private Timestamp manifestTime;

	private float total;

	private short type;

	private short status;

	private String comment;

	private String attachment;

	private ManifestPO quoteManifest;
	
	private int company;

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
	@Column(name = "mid")
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
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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
	
	public ManifestPO init(String code, short type, UserPO creater, Timestamp manifestTime, String attachment, String comment, ManifestPO quote, int company){
		
		this.setCode(code);
		this.setType(type);
		this.setStatus(STATUS_INIT_INT);
		this.setCompany(company);
		
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setManifestTime(manifestTime);
		
		this.setCreater(creater);
		this.setQuoteManifest(quote);
		
		this.setAttachment(attachment);
		this.setComment(comment);
		
		return this;
	}
	
	public ManifestPO init(String code, short type, UserPO creater, short status, String attachment, String comment, ManifestPO quote, int company){
		
		this.setCode(code);
		this.setType(type);
		this.setStatus(status);
		this.setCompany(company);
		
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		
		this.setCreater(creater);
		this.setQuoteManifest(quote);
		
		this.setAttachment(attachment);
		this.setComment(comment);
		
		return this;
	}

}