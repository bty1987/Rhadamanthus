package com.fanglin.data.po;

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
@Table(name = "normpackItem", catalog = "data")
public class NormpackItemPO implements Serializable{

	private static final long serialVersionUID = 1L;

	private long npiid;

	private long npid;

	private GoodsPO goods;

	private String normunit;// 定额单位

	private int normnum;// 定额数量

	private String storeunit;// 库房单位
	
	private int storenum;// 库房数量

	public NormpackItemPO() {
		super();
	}

	public NormpackItemPO(long npiid) {
		super();
		this.npiid = npiid;
	}

	public NormpackItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "npiid")
	public long getNpiid() {
		return npiid;
	}

	public void setNpiid(long npiid) {
		this.npiid = npiid;
	}

	@Column(name = "npid")
	public long getNpid() {
		return npid;
	}

	public void setNpid(long npid) {
		this.npid = npid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName="gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}
	
	@Column(name = "normunit")
	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	@Column(name = "normnum")
	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	@Column(name = "storeunit")
	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	@Column(name = "storenum")
	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}
	
}
