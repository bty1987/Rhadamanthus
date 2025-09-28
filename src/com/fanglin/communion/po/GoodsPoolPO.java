package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "goodsPool", catalog = "communion")
public class GoodsPoolPO implements java.io.Serializable {

	private static final long serialVersionUID = 248559820833138015L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_BARCODE_STR = "barcode";

	public static final String COLUMN_CATEGORY_STR = "category";

	public static final String COLUMN_BID_STR = "bid";

	public static final String COLUMN_BRAND_STR = "brand";

	public static final String COLUMN_ATID_STR = "accessoriesType.atid";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short TYPE_GOODS_INT = 0;

	public static final short TYPE_SUIT_INT = 1;

	public static final short BRAND_STATUS_INT = 0;

	public static final short CASCADE_YES_SHORT = 1; // 级联

	private long gpid;

	private String no;

	private String name;

	private String alias;

	private String pinyin;

	private String barcode;

	private String category;

	private long bid;

	private String brand;

	private String measurementUnit;

	private int purchase;

	private int selling;

	private int confine;

	private int pieceNum;

	private AccessoriesTypePO accessoriesType;

	private short type;

	private short atttype;

	private GoodsKindPO zerokind;

	private GoodsKindPO onekind;

	private GoodsKindPO twokind;

	private GoodsKindPO thrkind;

	private String path;

	private String series;

	private String elevel;

	private String material;

	private String quality;

	private String color;

	private String format;

	private String model;

	private short status;

	private short colorcascade; // 1:级联 2:不级联 4:控制 8:不控制

	private short formatcascade; // 1:级联 2:不级联 4:控制 8:不控制

	private short pricecascade; // 1:级联 2:不级联 4:控制 8:不控制 16:价格控制

	private short picturecascade; // 1:级联 2:不级联 4:控制 8:不控制

	public GoodsPoolPO() {
		super();
	}

	public GoodsPoolPO(long gpid) {
		super();
		this.gpid = gpid;
	}

	public GoodsPoolPO(AccessoriesTypePO accessoriesType) {
		super();
		this.accessoriesType = accessoriesType;
	}

	public GoodsPoolPO(AccessoriesTypePO accessoriesType, GoodsKindPO zerokind, GoodsKindPO onekind, GoodsKindPO twokind, GoodsKindPO thrkind) {

		super();

		this.accessoriesType = accessoriesType;

		this.zerokind = zerokind;
		this.onekind = onekind;
		this.twokind = twokind;
		this.thrkind = thrkind;
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

	@Column(name = "no")
	public String getNo() {
		return this.no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "barcode")
	public String getBarcode() {
		return this.barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	@Column(name = "category")
	public String getCategory() {
		return this.category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return this.measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
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

	@Column(name = "pieceNum")
	public int getPieceNum() {
		return pieceNum;
	}

	public void setPieceNum(int pieceNum) {
		this.pieceNum = pieceNum;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "atid", referencedColumnName = "atid")
	public AccessoriesTypePO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypePO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "zerokind", referencedColumnName = "gkid")
	public GoodsKindPO getZerokind() {
		return zerokind;
	}

	public void setZerokind(GoodsKindPO zerokind) {
		this.zerokind = zerokind;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "onekind", referencedColumnName = "gkid")
	public GoodsKindPO getOnekind() {
		return onekind;
	}

	public void setOnekind(GoodsKindPO onekind) {
		this.onekind = onekind;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "twokind", referencedColumnName = "gkid")
	public GoodsKindPO getTwokind() {
		return twokind;
	}

	public void setTwokind(GoodsKindPO twokind) {
		this.twokind = twokind;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "thrkind", referencedColumnName = "gkid")
	public GoodsKindPO getThrkind() {
		return thrkind;
	}

	public void setThrkind(GoodsKindPO thrkind) {
		this.thrkind = thrkind;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "colorcascade")
	public short getColorcascade() {
		return colorcascade;
	}

	public void setColorcascade(short colorcascade) {
		this.colorcascade = colorcascade;
	}

	@Column(name = "formatcascade")
	public short getFormatcascade() {
		return formatcascade;
	}

	public void setFormatcascade(short formatcascade) {
		this.formatcascade = formatcascade;
	}

	@Column(name = "pricecascade")
	public short getPricecascade() {
		return pricecascade;
	}

	public void setPricecascade(short pricecascade) {
		this.pricecascade = pricecascade;
	}

	@Column(name = "picturecascade")
	public short getPicturecascade() {
		return picturecascade;
	}

	public void setPicturecascade(short picturecascade) {
		this.picturecascade = picturecascade;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "series")
	public String getSeries() {
		return series;
	}

	public void setSeries(String series) {
		this.series = series;
	}

	@Column(name = "elevel")
	public String getElevel() {
		return elevel;
	}

	public void setElevel(String elevel) {
		this.elevel = elevel;
	}

	@Column(name = "material")
	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	@Column(name = "quality")
	public String getQuality() {
		return quality;
	}

	public void setQuality(String quality) {
		this.quality = quality;
	}

	@Column(name = "color")
	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "model")
	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	public GoodsPoolVO ptv(GoodsPoolVO goodsPoolVO) {

		BeanUtil.copyProperties(this, goodsPoolVO, Arrays.asList("accessoriesType", "onekind", "twokind", "thrkind"));

		if (goodsPoolVO.getAccessoriesType() != null && getAccessoriesType() != null) BeanUtil.copyProperties(getAccessoriesType(), goodsPoolVO.getAccessoriesType(), Arrays.asList("workType"));

		if (goodsPoolVO.getZerokind() != null && getZerokind() != null) BeanUtil.copyProperties(getZerokind(), goodsPoolVO.getZerokind());
		if (goodsPoolVO.getOnekind() != null && getOnekind() != null) BeanUtil.copyProperties(getOnekind(), goodsPoolVO.getOnekind());
		if (goodsPoolVO.getTwokind() != null && getTwokind() != null) BeanUtil.copyProperties(getTwokind(), goodsPoolVO.getTwokind());
		if (goodsPoolVO.getThrkind() != null && getThrkind() != null) BeanUtil.copyProperties(getThrkind(), goodsPoolVO.getThrkind());

		return goodsPoolVO;
	}
}