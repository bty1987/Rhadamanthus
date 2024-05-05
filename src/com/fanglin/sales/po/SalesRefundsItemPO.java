package com.fanglin.sales.po;

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
@Table(name = "salesrefundsitem", catalog = "sales")
public class SalesRefundsItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -8157873351014476905L;

	public static final String COLUMN_RIID_STR = "riid";

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_RID_STR = "rid";

	public static final String COLUMN_SIID_STR = "siid";

	public static final String COLUMN_TOTAL_STR = "total";

	public static final String COLUMN_NUM_STR = "num";

	private long riid;// 退货项id

	private long sid; // 销售单Id

	private long rid; // 款项id

	private SalesItemPO salesItem; // 销售项

	private long num; // 数量

	private long total;// 总额

	public SalesRefundsItemPO(long riid) {
		super();
		this.riid = riid;
	}

	public SalesRefundsItemPO() {
		super();

	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "riid")
	public long getRiid() {
		return riid;
	}

	public void setRiid(long riid) {
		this.riid = riid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@Column(name = "num")
	public long getNum() {
		return num;
	}

	public void setNum(long num) {
		this.num = num;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siid", referencedColumnName = "siid")
	public SalesItemPO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemPO salesItem) {
		this.salesItem = salesItem;
	}

	public void setCreater(SalesItemPO salesitem) {
		this.salesItem = salesitem;
	}

}
