package com.fanglin.inventory.po;

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
@Table(name = "assisorderitem", catalog = "inventory")
public class AssisOrderItemPO implements Serializable{

	private static final long serialVersionUID = -7755475355194951377L;
	
	public static final String COLUMN_AOID_STR = "aoid";
	
	public static final String COLUMN_AOIDS_STR = "aoids";
	
	private long aoiid;
	
	private long aoid;
	
	private GoodsPO goods;
	
	private ColorPO color;
	
	private FormatPO format;
	
	private float num;
	
	public AssisOrderItemPO() {
		super();
	}

	public AssisOrderItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	public AssisOrderItemPO(GoodsPO goods, ColorPO color, FormatPO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) 
	@Column(name = "aoiid")
	public long getAoiid() {
		return aoiid;
	}

	public void setAoiid(long aoiid) {
		this.aoiid = aoiid;
	}
	
	@Column(name = "aoid")
	public long getAoid() {
		return aoid;
	}

	public void setAoid(long aoid) {
		this.aoid = aoid;
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

	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

}
