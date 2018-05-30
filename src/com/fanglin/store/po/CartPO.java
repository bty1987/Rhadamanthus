package com.fanglin.store.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "cart", catalog = "store")
public class CartPO implements Serializable{

	private static final long serialVersionUID = -183752142668984998L;
	
	public static final String COLUMN_UID_STR = "muser.uid";

	private long cid;
	
	private MuserPO muser;
	
	private MpricePO mprice;
	
	private short num;

	public CartPO() {
		super();
	}

	public CartPO(MuserPO muser, MpricePO mprice) {
		super();
		this.muser = muser;
		this.mprice = mprice;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName="uid")
	public MuserPO getMuser() {
		return muser;
	}

	public void setMuser(MuserPO muser) {
		this.muser = muser;
	}


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName="pid")
	public MpricePO getMprice() {
		return mprice;
	}

	
	public void setMprice(MpricePO mprice) {
		this.mprice = mprice;
	}
	
	@Column(name = "num")
	public short getNum() {
		return num;
	}

	public void setNum(short num) {
		this.num = num;
	}

}
