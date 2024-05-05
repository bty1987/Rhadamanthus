package com.fanglin.data.po;

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
@Table(name = "normood", catalog = "data")
public class NormoodPO implements Serializable {

	private static final long serialVersionUID = -7965664559026894507L;

	public static final String COLUMN_QIID_STR = "quotationItem.qiid";

	public static final String COLUMN_QUOTATIONITEMNAME_STR = "quotationItem.name";

	public static final String COLUMN_QUOTATIONVERSION_STR = "quotationItem.quotationVersion.no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_QUOTATIONITEMNO_STR = "quotationItem.no";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_VALID_STR = 0;

	public static final short STATUS_INVALID_STR = 1;

	private long ngid;// 定定额材料id

	private String name;

	private QuotationItemPO quotationItem; // 报价id

	private NoodsPO noods; // 定材

	private String normunit; // 定额单位

	private int normnum; // 定额数量

	private String storeunit; // 库房单位

	private int storenum; // 库房数量

	private int price;

	private short status;// 状态

	public NormoodPO() {
		super();
	}

	public NormoodPO(QuotationItemPO quotationItem) {
		super();
		this.quotationItem = quotationItem;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ngid")
	public long getNgid() {
		return ngid;
	}

	public void setNgid(long ngid) {
		this.ngid = ngid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qiid", referencedColumnName = "qiid")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "nid", referencedColumnName = "nid")
	public NoodsPO getNoods() {
		return noods;
	}

	public void setNoods(NoodsPO noods) {
		this.noods = noods;
	}

	@Column(name = "normunit")
	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	@Column(name = "normnum")
	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	@Column(name = "storeunit")
	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	@Column(name = "storenum")
	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
