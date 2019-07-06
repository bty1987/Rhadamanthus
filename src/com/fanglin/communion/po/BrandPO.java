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

	public static final String COLUMN_BID_INT = "bid";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_CATEGORYNO_STR = "no";

	private long bid;

	private String no;

	private String name;

	private String pinyin;

	private CategoryPO category;

	private int company;

	private String kino;

	private String kiname;

	public BrandPO() {
		super();
	}

	public BrandPO(long bid) {
		super();
		this.bid = bid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bid")
	public long getBid() {
		return this.bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
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

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

}