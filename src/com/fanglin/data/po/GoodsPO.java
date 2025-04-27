package com.fanglin.data.po;

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

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "goods", catalog = "data")
public class GoodsPO implements java.io.Serializable {

	private static final long serialVersionUID = -8157873351014476905L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_GPID_STR = "gpid";

	public static final String COLUMN_COMPANY_STR = "company";

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

	private long gid;

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

	private GoodsKindPO onekind;

	private GoodsKindPO twokind;

	private GoodsKindPO thrkind;

	private String path;

	private short isShow;

	private short status;

	private int company;

	public GoodsPO() {
		super();
	}

	public GoodsPO(long gid) {
		super();
		this.gid = gid;
	}

	public GoodsPO(AccessoriesTypePO accessoriesType) {
		super();
		this.accessoriesType = accessoriesType;
	}

	public GoodsPO(AccessoriesTypePO accessoriesType, GoodsKindPO onekind, GoodsKindPO twokind, GoodsKindPO thrkind) {
		super();
		this.accessoriesType = accessoriesType;
		this.onekind = onekind;
		this.twokind = twokind;
		this.thrkind = thrkind;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gid")
	public long getGid() {
		return this.gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

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

	@Column(name = "isShow")
	public short getIsShow() {
		return isShow;
	}

	public void setIsShow(short isShow) {
		this.isShow = isShow;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
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

	public GoodsVO ptv(GoodsVO goodsVO) {

		BeanUtil.copyProperties(this, goodsVO, Arrays.asList("accessoriesType", "onekind", "twokind", "thrkind"));

		if (goodsVO.getAccessoriesType() != null && getAccessoriesType() != null) BeanUtil.copyProperties(getAccessoriesType(), goodsVO.getAccessoriesType(), Arrays.asList("workType"));
		if (goodsVO.getOnekind() != null && getOnekind() != null) BeanUtil.copyProperties(getOnekind(), goodsVO.getOnekind());
		if (goodsVO.getTwokind() != null && getTwokind() != null) BeanUtil.copyProperties(getTwokind(), goodsVO.getTwokind());
		if (goodsVO.getThrkind() != null && getThrkind() != null) BeanUtil.copyProperties(getThrkind(), goodsVO.getThrkind());

		return goodsVO;
	}
}