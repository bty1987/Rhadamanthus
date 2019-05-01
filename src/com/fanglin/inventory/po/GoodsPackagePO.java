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
@Table(name = "goodspackage", catalog = "inventory")
public class GoodsPackagePO implements Serializable {

	private static final long serialVersionUID = -2129826916198144693L;

	public static final String COLUMN_PIG_STR = "pid";

	private long gpid;

	private long pid; // 被绑商品ID

	private GoodsPO goods; // 绑定商品ID

	private ColorPO color;

	private FormatPO format;

	private float num;

	public GoodsPackagePO() {
		super();
	}

	public GoodsPackagePO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	public GoodsPackagePO(GoodsPO goods, ColorPO color, FormatPO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gpid")
	public long getGpid() {
		return gpid;
	}

	public void setGpid(long gpid) {
		this.gpid = gpid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
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
