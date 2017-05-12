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
@Table(name="purchaseItem", catalog = "inventory")
public class PurchaseItemPO  implements Serializable{
	
	private static final long serialVersionUID = -6693806406372510849L;

	public static final String COLUMN_PID_STR = "pid";                //采购单ID
	
	public static final String COLUMN_PIID_STR = "piId";              //采购项ID
	
	public static final String COLUMN_GOODS_STR = "goods.goods";      //商品类型
	
	public static final String COLUMN_COLOR_STR = "color.color";      //商品颜色类型
	
	public static final String COLUMN_FORMAT_STR = "format.format";   //商品规格
	
	public static final String COLUMN_NUM_STR = "num";                //数量
	
	public static final String COLUMN_SPRPLUS_STR = "surplus";        //剩余数量
	
	private Long piId;
	
	private Long pid;
	
	private GoodsPO goods;

	private ColorPO color;
	
	private FormatPO format;
	
	private Float num; 
	
	private Float surplus;
	
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
	@Column(name="piId")
	public Long getPiId() {
		return piId;
	}

	public void setPiId(Long piId) {
		this.piId = piId;
	}
	
	@Column(name="pid")
	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
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

	@Column(name="num")
	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	@Column(name="surplus")
	public Float getSurplus() {
		return surplus;
	}

	public void setSurplus(Float surplus) {
		this.surplus = surplus;
	}

}
