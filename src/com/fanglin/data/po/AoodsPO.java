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
@Table(name = "aoods", catalog = "data")
public class AoodsPO implements Serializable {

	private static final long serialVersionUID = -7644266247269577044L;
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_BOMPANY_STR = "bompany";
	
	public static final String COLUMN_AID_STR = "aid";
	
	public static final String COLUMN_NAME_STR = "goods.name";
	
	public static final String COLUMN_ANAME_STR = "accessoriesType.name";
	
	public static final String COLUMN_NO_STR = "goods.no";
	
	public static final String COLUMN_PINYIN_STR = "goods.pinyin";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short CHECKUP_CHECK_INT = 0;
	
	private long aid;
	
	private GoodsPO goods;
	
	private AccessoriesTypePO accessoriesType;
	
	private short checkup;
	
	private short status;
	
	private int company;
	
	private int bompany;
	
	public AoodsPO(){
		super();
	}
	
	public AoodsPO(long aid) {
		super();
		this.aid = aid;
	}
	
	public AoodsPO(AccessoriesTypePO accessoriesType, GoodsPO goods) {
		super();
		this.accessoriesType = accessoriesType;
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "atid", referencedColumnName = "atid")
	public AccessoriesTypePO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypePO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	@Column(name = "checkup")
	public short getCheckup() {
		return checkup;
	}

	public void setCheckup(short checkup) {
		this.checkup = checkup;
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

	@Column(name = "bompany")
	public int getBompany() {
		return bompany;
	}

	public void setBompany(int bompany) {
		this.bompany = bompany;
	}

}
