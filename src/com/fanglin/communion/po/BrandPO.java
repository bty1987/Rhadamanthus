package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "brand", catalog = "communion")
public class BrandPO implements java.io.Serializable {
	
	private static final long serialVersionUID = -1250639697212151929L;
	
	public static final String COLUMN_BID_STR = "bid";
	
	public static final String COLUMN_BRANDID_STR = "brandId";
	
	public static final String COLUMN_BRANDNAME_STR = "brandName";
	
	public static final String COLUMN_BRANDNAMEPINYIN_STR = "brandNamePinyin";
	
	public static final String COLUMN_CATEGORYID_STR = "categoryId";

	private long bid;
	
	private String brandId;
	
	private String brandName;
	
	private String brandNamePinyin;
	
	private CategoryPO category;
	
	private int company;
	
	public BrandPO() {
		super();
	}
	
	public BrandPO(long bid) {
		super();
		this.bid = bid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bId")
	public long getBid() {
		return this.bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "brandId")
	public String getBrandId() {
		return this.brandId;
	}

	public void setBrandId(String brandId) {
		this.brandId = brandId;
	}

	@Column(name = "brandName")
	public String getBrandName() {
		return this.brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	@Column(name = "brandNamePinyin")
	public String getBrandNamePinyin() {
		return this.brandNamePinyin;
	}

	public void setBrandNamePinyin(String brandNamePinyin) {
		this.brandNamePinyin = brandNamePinyin;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cId", referencedColumnName = "cId")
	public CategoryPO getCategory() {
		return category;
	}

	public void setCategory(CategoryPO category) {
		this.category = category;
	}
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
	

}