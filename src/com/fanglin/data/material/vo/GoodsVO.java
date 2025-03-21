package com.fanglin.data.material.vo;

import com.fanglin.data.common.vo.GoodsKindVO;

public class GoodsVO implements java.io.Serializable {

	private static final long serialVersionUID = 5543447445422987680L;

	private Long gid;

	private String no;

	private String name;

	private String alias;

	private String pinyin;

	private String barcode;

	private String category;

	private Long bid;

	private String brand;

	private String measurementUnit;

	private Integer purchase;

	private Integer selling;

	private Integer confine;

	private Integer pieceNum;

	private AccessoriesTypeVO accessoriesType;

	private Short type;

	private GoodsKindVO onekind;

	private GoodsKindVO twokind;

	private GoodsKindVO thrkind;

	private String path;

	private Short status;

	private Short checkup;

	public GoodsVO() {
		super();
	}

	public GoodsVO(Long gid) {
		super();
		this.gid = gid;
	}

	public GoodsVO(AccessoriesTypeVO accessoriesType) {
		super();
		this.accessoriesType = accessoriesType;
	}

	public GoodsVO(AccessoriesTypeVO accessoriesType, GoodsKindVO onekind, GoodsKindVO twokind, GoodsKindVO thrkind) {
		super();
		this.accessoriesType = accessoriesType;
		this.onekind = onekind;
		this.twokind = twokind;
		this.thrkind = thrkind;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public Integer getPurchase() {
		return purchase;
	}

	public void setPurchase(Integer purchase) {
		this.purchase = purchase;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getConfine() {
		return confine;
	}

	public void setConfine(Integer confine) {
		this.confine = confine;
	}

	public Integer getPieceNum() {
		return pieceNum;
	}

	public void setPieceNum(Integer pieceNum) {
		this.pieceNum = pieceNum;
	}

	public AccessoriesTypeVO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypeVO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public GoodsKindVO getOnekind() {
		return onekind;
	}

	public void setOnekind(GoodsKindVO onekind) {
		this.onekind = onekind;
	}

	public GoodsKindVO getTwokind() {
		return twokind;
	}

	public void setTwokind(GoodsKindVO twokind) {
		this.twokind = twokind;
	}

	public GoodsKindVO getThrkind() {
		return thrkind;
	}

	public void setThrkind(GoodsKindVO thrkind) {
		this.thrkind = thrkind;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getCheckup() {
		return checkup;
	}

	public void setCheckup(Short checkup) {
		this.checkup = checkup;
	}

}