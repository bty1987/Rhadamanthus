package com.fanglin.inventory.vo;

public class GoodsVO implements java.io.Serializable {

	private static final long serialVersionUID = 5543447445422987680L;

	private Long gid;
	
	private Integer company;
	
	private String no;
	
	private String name;
	
	private String pinyin;
	
	private String barcode;
	
	private String category;
	
	private String brand;
	
	private String measurementUnit;
	
	private Float pieceNum;
	
	private AssisTypeVO assisType;
	
	private Short type;
	
	private Short status;
	
	public GoodsVO() {
		super();
	}

	public GoodsVO(AssisTypeVO assisType) {
		super();
		this.assisType = assisType;
	}

	public Long getGid() {
		return this.gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getNo() {
		return this.no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBarcode() {
		return this.barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getCategory() {
		return this.category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return this.brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getMeasurementUnit() {
		return this.measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public Float getPieceNum() {
		return pieceNum;
	}

	public void setPieceNum(Float pieceNum) {
		this.pieceNum = pieceNum;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public AssisTypeVO getAssisType() {
		return assisType;
	}

	public void setAssisType(AssisTypeVO assisType) {
		this.assisType = assisType;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}