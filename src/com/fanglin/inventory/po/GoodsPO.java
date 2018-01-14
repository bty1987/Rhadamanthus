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
@Table(name = "goods", catalog = "inventory")
public class GoodsPO implements java.io.Serializable {

	private static final long serialVersionUID = -8157873351014476905L;
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_PINYIN_STR = "pinyin";
	
	public static final String COLUMN_BARCODE_STR = "barcode";
	
	public static final String COLUMN_CATEGORY_STR = "category";
	
	public static final String COLUMN_BRAND_STR = "brand";
	
	public static final String COLUMN_ATID_STR = "accessoriesType.atid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	public static final short TYPE_GOODS_INT = 0;
	
	public static final short TYPE_SUIT_INT = 1;
	
	private long gid;
	
	private int company;
	
	private String no;
	
	private String name;
	
	private String pinyin;
	
	private String barcode;
	
	private String category;
	
	private String brand;
	
	private String measurementUnit;
	
	private float pieceNum;
	
	private AccessoriesTypePO accessoriesType;
	
	private short type;
	
	private short status;
	
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

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gId")
	public long getGid() {
		return this.gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
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

	@Column(name = "brand")
	public String getBrand() {
		return this.brand;
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
	
	@Column(name = "pieceNum")
	public float getPieceNum() {
		return pieceNum;
	}

	public void setPieceNum(float pieceNum) {
		this.pieceNum = pieceNum;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "atid", referencedColumnName = "atid")
	public AccessoriesTypePO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypePO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}
	
	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}
	
	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}