package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.material.vo.GoodsPackageVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "goodspackage", catalog = "data")
public class GoodsPackagePO implements Serializable {

	private static final long serialVersionUID = -2129826916198144693L;

	public static final String COLUMN_PIG_STR = "pid";

	private long gpid;

	private long pid; // 被绑商品ID

	private GoodsPO goods; // 绑定商品ID

	private ColorPO color;

	private FormatPO format;

	private int num;

	private int purchase; // 限价

	private int selling; // 售价

	private int confine; // 控价

	private short ctype; // 结算类型

	private int cvalue; // 结算值

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
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "purchase")
	public int getPurchase() {
		return purchase;
	}

	public void setPurchase(int purchase) {
		this.purchase = purchase;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "confine")
	public int getConfine() {
		return confine;
	}

	public void setConfine(int confine) {
		this.confine = confine;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	public GoodsPackageVO ptv(GoodsPackageVO goodsPackageVO) {

		BeanUtil.copyProperties(this, goodsPackageVO, Arrays.asList("goods", "color", "format"));

		if (goodsPackageVO.getGoods() != null && getGoods() != null) getGoods().ptv(goodsPackageVO.getGoods());
		if (goodsPackageVO.getColor() != null && getColor() != null) getColor().ptv(goodsPackageVO.getColor());
		if (goodsPackageVO.getFormat() != null && getFormat() != null) getFormat().ptv(goodsPackageVO.getFormat());

		return goodsPackageVO;
	}
}
