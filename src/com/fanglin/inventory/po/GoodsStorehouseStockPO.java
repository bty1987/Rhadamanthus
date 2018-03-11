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
@Table(name = "goodsstorehousestock", catalog = "inventory")
public class GoodsStorehouseStockPO implements java.io.Serializable {

	private static final long serialVersionUID = -6395802438033833729L;
	
	public static final String COLUMN_GID_STR = "goods.gid";
	
	public static final String COLUMN_NAME_STR = "goods.name";
	
	public static final String COLUMN_CODE_STR = "goods.barcode";
	
	public static final String COLUMN_FID_STR = "format.fid";
	
	public static final String COLUMN_CID_STR = "color.cid";
	
	public static final String COLUMN_SHID_STR = "storehouse.shId";
	
	public static final String COLUMN_SNAME_STR = "name";
	
	public static final String COLUMN_BARCODE_STR = "barcode";
	
	public static final String COLUMN_STOREHOUSNAME_STR = "storehouse.name";
	
	private long gshsId;
	
	private GoodsPO goods;
	
	private ColorPO color;
	
	private FormatPO format;
	
	private StorehousePO storehouse;
	
	private float num;
	
	public GoodsStorehouseStockPO() {
		super();
	}

	public GoodsStorehouseStockPO(GoodsPO goods, ColorPO color,FormatPO format, StorehousePO storehouse) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
		this.storehouse = storehouse;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gshsId")
	public long getGshsId() {
		return gshsId;
	}

	public void setGshsId(long gshsId) {
		this.gshsId = gshsId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ColorPO getColor() {
		return color;
	}

	public void setColor(ColorPO color) {
		this.color = color;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fid", referencedColumnName = "fid")
	public FormatPO getFormat() {
		return format;
	}

	public void setFormat(FormatPO format) {
		this.format = format;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shId", referencedColumnName = "shId")
	public StorehousePO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehousePO storehouse) {
		this.storehouse = storehouse;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

}