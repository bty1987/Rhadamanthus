package com.fanglin.communion.vo;

import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.material.vo.AccessoriesTypeVO;

public class GoodsPoolVO implements java.io.Serializable {

	private static final long serialVersionUID = -3962253894231796196L;

	private Long gpid;

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

	private Short colorcascade;

	private Short formatcascade;

	private Short pricecascade;

	private Short picturecascade;

	private Short status;

	public GoodsPoolVO() {
		super();
	}

	public GoodsPoolVO(Long gpid) {
		super();
		this.gpid = gpid;
	}

	public GoodsPoolVO(AccessoriesTypeVO accessoriesType) {
		super();
		this.accessoriesType = accessoriesType;
	}

	public GoodsPoolVO(AccessoriesTypeVO accessoriesType, GoodsKindVO onekind, GoodsKindVO twokind, GoodsKindVO thrkind) {
		super();
		this.accessoriesType = accessoriesType;
		this.onekind = onekind;
		this.twokind = twokind;
		this.thrkind = thrkind;
	}

	public Long getGpid() {
		return gpid;
	}

	public void setGpid(Long gpid) {
		this.gpid = gpid;
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

	public Short getColorcascade() {
		return colorcascade;
	}

	public void setColorcascade(Short colorcascade) {
		this.colorcascade = colorcascade;
	}

	public Short getFormatcascade() {
		return formatcascade;
	}

	public void setFormatcascade(Short formatcascade) {
		this.formatcascade = formatcascade;
	}

	public Short getPricecascade() {
		return pricecascade;
	}

	public void setPricecascade(Short pricecascade) {
		this.pricecascade = pricecascade;
	}

	public Short getPicturecascade() {
		return picturecascade;
	}

	public void setPicturecascade(Short picturecascade) {
		this.picturecascade = picturecascade;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}