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

import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "audit", catalog = "platform")
public class AuditPO implements Serializable {

	private static final long serialVersionUID = -6062235951940054913L;
	
	public static final String COLUMN_ORDERID_STR = "decorationOrder.orderId";
	
	private long aid;
	
	private DecorationOrderPO decorationOrder;
	
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
	public DecorationOrderPO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder) {
		this.decorationOrder = decorationOrder;
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

	public AuditPO(DecorationOrderPO decorationOrder, UserPO auditer) {
		super();
		this.decorationOrder = decorationOrder;
		this.auditer = auditer;
	}

}
