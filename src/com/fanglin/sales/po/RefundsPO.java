package com.fanglin.sales.po;

import java.sql.Timestamp;

import javax.persistence.Column;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="refunds" ,catalog = "inventory")
public class  RefundsPO  implements  java.io.Serializable{
	
	private static final long serialVersionUID = -8157873351014476905L;
	
	public static final String COLUMN_RID_STR = "rid";
	
	public static final String COLUMN_SID_STR = "sid";
	
	public static final String COLUMN_SPID_STR = "spid";
	
	public static final String COLUMN_TOTAL_STR = "total";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_TYPE_REFUNDS_INT = 0;
	
	public static final String COLUMN_CUID_STR = "user.uid";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_BALANCETIME_STR = "balanceTime";
	
	private long rid; //退货单id
	
	private long sid;//销售单id
	
	private long spid; //款项id
	
	private float total; //合计
	
	private short status; //状态
	
	private String comment; //说明
	
	private UserPO creater; //创建人
	
	private Timestamp createTime;//创建时间
	 
	private Timestamp balanceTime;//结算时间

	public RefundsPO(long rid) {
		super();
		this.rid = rid;
	}

	public RefundsPO() {
		super();
		
	}
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rid")
	public long getRid() {
		return rid;
	}
	
	public void setRid(long rid) {
		this.rid = rid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}
	

	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@Column(name="total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
}
