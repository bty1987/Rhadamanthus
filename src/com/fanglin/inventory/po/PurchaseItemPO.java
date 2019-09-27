package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;
import java.io.Serializable;

@Entity
@Table(name = "purchaseItem", catalog = "inventory")
public class PurchaseItemPO implements Serializable {

	private static final long serialVersionUID = -6693806406372510849L;

	public static final String COLUMN_PID_STR = "pid"; // 采购单ID

	public static final String COLUMN_SIID_STR = "siid"; // 销售单ID

	public static final String COLUMN_PIID_STR = "piId"; // 采购项ID

	public static final String COLUMN_GOODS_STR = "goods.goods"; // 商品类型

	public static final String COLUMN_COLOR_STR = "color.color"; // 商品颜色类型

	public static final String COLUMN_FORMAT_STR = "format.format"; // 商品规格

	public static final String COLUMN_NUM_STR = "num"; // 数量

	public static final String COLUMN_SPRPLUS_STR = "surplus"; // 剩余数量

	private long piid;

	private long pid;

	private long siid;

	private GoodsPO goods;

	private ColorPO color;

	private FormatPO format;

	private int inprice;

	private int num;

	private int surplus;
	
	public PurchaseItemPO init(long pid, Long siid, long gid, long cid, long fid, int inprice, int num){
		
		setPid(pid);
		
		if(siid != null) setSiid(siid);
		
		setGoods(new GoodsPO(gid));
		setColor(new ColorPO(cid));
		setFormat(new FormatPO(fid));
		
		setInprice(inprice);
		setNum(num);
		setSurplus(num);
		
		return this;
	}

	public PurchaseItemPO() {
		super();
	}

	public PurchaseItemPO(GoodsPO goods, ColorPO color, FormatPO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	public PurchaseItemPO(Long pid) {
		super();
		this.pid = pid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "piid")
	public long getPiid() {
		return piid;
	}

	public void setPiid(long piid) {
		this.piid = piid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
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

	@Column(name = "inprice")
	public int getInprice() {
		return inprice;
	}

	public void setInprice(int inprice) {
		this.inprice = inprice;
	}
	
	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}

}
