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
@Table(name = "mprice", catalog = "store")
public class MpricePO implements Serializable{

	private static final long serialVersionUID = 2425009342852807536L;
	
	public static final String COLUMN_GID_STR = "mgoods.gid";
	
	public static final String COLUMN_CID_STR = "mcolor.cid";
	
	public static final String COLUMN_FID_STR = "mformat.fid";
	
	public static final String COLUMN_BID_STR = "mgoods.mbrand.bid";
	
	public static final String COLUMN_PID_STR = "pid";
	
	public static final String COLUMN_PRICE_STR = "price";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;

	private long pid;
	
	private String name;
	 
	private float price;
	
	private MgoodsPO mgoods;
	
	private McolorPO mcolor;
	
	private MformatPO mformat;
	
	private String img;
	
	private short status;

	public MpricePO() {
		super();
	}
	
	public MpricePO(MgoodsPO goods, McolorPO color, MformatPO format) {
		super();
		this.mgoods = goods;
		this.mcolor = color;
		this.mformat = format;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "price")
	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName="gid")
	public MgoodsPO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsPO mgoods) {
		this.mgoods = mgoods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName="cid")
	public McolorPO getMcolor() {
		return mcolor;
	}

	public void setMcolor(McolorPO mcolor) {
		this.mcolor = mcolor;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fid", referencedColumnName="fid")
	public MformatPO getMformat() {
		return mformat;
	}

	public void setMformat(MformatPO mformat) {
		this.mformat = mformat;
	}

	@Column(name = "img")
	public String getImg() {
		return img;
	}
	
	public void setImg(String img) {
		this.img = img;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
