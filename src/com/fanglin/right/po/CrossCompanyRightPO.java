package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "crosscompanyright", catalog = "platform")
public class CrossCompanyRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 6387114290498472594L;

	public static final String MODULE_CUSTOMER_STR = "customer";

	public static final String MODULE_DECORATION_STR = "decoration";

	public static final String MODULE_PAYMENT_STR = "payment";

	public static final String MODULE_SALES_STR = "sales";

	public static final String COLUMN_UID_STR = "uid";

	private int ucrid;

	private int uid;

	private String module;

	private String cids;

	private short status;

	private int cuid;

	private Timestamp createTime;

	public CrossCompanyRightPO() {
		super();
	}

	public CrossCompanyRightPO(int uid, String module, String cids, int cuid) {
		super();
		this.uid = uid;
		this.module = module;
		this.cids = cids;
		this.cuid = cuid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ucrid")
	public int getUcrid() {
		return ucrid;
	}

	public void setUcrid(int ucrid) {
		this.ucrid = ucrid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@Column(name = "module")
	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	@Column(name = "cids")
	public String getCids() {
		return cids;
	}

	public void setCids(String cids) {
		this.cids = cids;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "cuid")
	public int getCuid() {
		return cuid;
	}

	public void setCuid(int cuid) {
		this.cuid = cuid;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
