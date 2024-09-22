package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.sales.po.OalesPO;

@Entity
@Table(name = "balanceoalesitem", catalog = "balance")
public class BalanceOalesItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 2759439741731461890L;

	public static final String COLUMN_BOIID_STR = "boiid";

	public static final String COLUMN_BOID_STR = "boid";

	private long boiid;	

	private long boid;

	private OalesPO oales;

	public BalanceOalesItemPO() {
		super();
	}

	public BalanceOalesItemPO(OalesPO oales) {
		super();
		this.oales = oales;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "boiid")
	public long getBoiid() {
		return boiid;
	}

	public void setBoiid(long boiid) {
		this.boiid = boiid;
	}

	@Column(name = "boid")
	public long getBoid() {
		return boid;
	}

	public void setBoid(long boid) {
		this.boid = boid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "oid", referencedColumnName = "oid")
	public OalesPO getOales() {
		return oales;
	}

	public void setOales(OalesPO oales) {
		this.oales = oales;
	}

}
