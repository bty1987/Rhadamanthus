package com.fanglin.inventory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "manifestitem", catalog = "inventory")
public class ManifestItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -2665091838341550211L;
	
	public static final String COLUMN_MID_STR = "mid";
	
	private long miId;
	
	private long mid;
	
	private GoodsPO goods;
	
	private ColorPO color;
	
	private FormatPO format;
	
	private StorehousePO instorehouse;
	
	private StorehousePO outstorehouse;
	
	private float num;
	
	private float purchasePrice;
	
	private String comment;

	public ManifestItemPO() {
		super();
	}
	
	public ManifestItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	public ManifestItemPO(GoodsPO goods, ColorPO color, FormatPO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "miId")
	public long getMiId() {
		return this.miId;
	}

	public void setMiId(long miId) {
		this.miId = miId;
	}

	@Column(name = "mId")
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
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
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ColorPO getColor() {
		return color;
	}

	public void setColor(ColorPO color) {
		this.color = color;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fid", referencedColumnName = "fid")
	public FormatPO getFormat() {
		return format;
	}

	public void setFormat(FormatPO format) {
		this.format = format;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ishId", referencedColumnName = "shId")
	public StorehousePO getInstorehouse() {
		return instorehouse;
	}

	public void setInstorehouse(StorehousePO instorehouse) {
		this.instorehouse = instorehouse;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oshId", referencedColumnName = "shId")
	public StorehousePO getOutstorehouse() {
		return outstorehouse;
	}

	public void setOutstorehouse(StorehousePO outstorehouse) {
		this.outstorehouse = outstorehouse;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "purchasePrice")
	public float getPurchasePrice() {
		return this.purchasePrice;
	}

	public void setPurchasePrice(float purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}