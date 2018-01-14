package com.fanglin.decoration.po;

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
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "audit", catalog = "platform")
public class AuditPO implements Serializable {

	private static final long serialVersionUID = -6062235951940054913L;
	
	public static final String COLUMN_ORDERID_STR = "decoration.orderId";
	
	private long aid;
	
	private DecorationPO decoration;
	
	private UserPO auditer ;
	
	private Timestamp auditTime;

	@Id
	@GeneratedValue
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "auid", referencedColumnName = "uid")
	public UserPO getAuditer() {
		return auditer;
	}

	public void setAuditer(UserPO auditer) {
		this.auditer = auditer;
	}

	@Column(name = "auditTime")
	public Timestamp getAuditTime() {
		return auditTime;
	}


	public void setAuditTime(Timestamp auditTime) {
		this.auditTime = auditTime;
	}
	
	public AuditPO() {
		super();
	}

	public AuditPO(DecorationPO decoration, UserPO auditer) {
		super();
		this.decoration = decoration;
		this.auditer = auditer;
	}

}
