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
@Table(name = "soodsitem", catalog = "data")
public class SoodsItemPO implements Serializable {

	private static final long serialVersionUID = 8101603114800600746L;

	public static final String COLUMN_NAME_STR = "goods.name";

	public static final String COLUMN_BRAND_STR = "goods.brand";

	public static final String COLUMN_CATEGORY_STR = "goods.category";

	public static final String COLUMN_QIID_STR = "quotationItem.qiid";

	public static final String COLUMN_SID_STR = "soods.sid";

	public static final String COLUMN_QNAME_STR = "quotationItem.name";

	public static final String COLUMN_VERSION_STR = "quotationItem.quotationVersion.no";

	public static final String COLUMN_QUOTATIONSMALLCATEGORYID_STR = "quotationSmallCategory.id";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_INVALID_INT = 1;

	private long siid;

	private SoodsPO soods;

	private QuotationItemPO quotationItem;

	private long gid;

	private short status;

	public SoodsItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
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
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SoodsPO getSoods() {
		return soods;
	}

	public void setSoods(SoodsPO soods) {
		this.soods = soods;
	}

	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
