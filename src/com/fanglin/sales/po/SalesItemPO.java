package com.fanglin.sales.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesitem", catalog = "sales")
public class SalesItemPO implements Serializable {

	private static final long serialVersionUID = 317677385751139684L;

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_SIID_STR = "siid";

	public static final short CTYPE_RESERVEPRICE_INT = 0;

	public static final short CTYPE_POINT_INT = 1;

	private long siid;

	private long sid;

	private GoodsPO goods;

	private ColorPO color;

	private FormatPO format;

	private int purchase;

	private int selling;

	private int discount;

	private int disPrice;

	private int postDis;

	private int price;

	private long num;

	private long initnum;

	private long punum;

	private long xgnum;

	private long total;

	private String comment;

	private short rawCtype;

	private int rawCvalue;

	private short ctype;

	private int cvalue;

	private short priceType;

	public SalesItemPO() {
		super();
	}

	public SalesItemPO(GoodsPO goods, ColorPO color, FormatPO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	@Id
	@GeneratedValue
	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "gId", referencedColumnName = "gId")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cId", referencedColumnName = "cId")
	public ColorPO getColor() {
		return color;
	}

	public void setColor(ColorPO color) {
		this.color = color;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "fId", referencedColumnName = "fId")
	public FormatPO getFormat() {
		return format;
	}

	public void setFormat(FormatPO format) {
		this.format = format;
	}

	@Column(name = "purchase")
	public int getPurchase() {
		return purchase;
	}

	public void setPurchase(int purchase) {
		this.purchase = purchase;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "disprice")
	public int getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(int disPrice) {
		this.disPrice = disPrice;
	}

	@Column(name = "postdis")
	public int getPostDis() {
		return postDis;
	}

	public void setPostDis(int postDis) {
		this.postDis = postDis;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "num")
	public long getNum() {
		return num;
	}

	public void setNum(long num) {
		this.num = num;
	}

	@Column(name = "initnum")
	public long getInitnum() {
		return initnum;
	}

	public void setInitnum(long initnum) {
		this.initnum = initnum;
	}

	@Column(name = "punum")
	public long getPunum() {
		return punum;
	}

	public void setPunum(long punum) {
		this.punum = punum;
	}

	@Column(name = "xgnum")
	public long getXgnum() {
		return xgnum;
	}

	public void setXgnum(long xgnum) {
		this.xgnum = xgnum;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "rawctype")
	public short getRawCtype() {
		return rawCtype;
	}

	public void setRawCtype(short rawCtype) {
		this.rawCtype = rawCtype;
	}

	@Column(name = "rawcvalue")
	public int getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(int rawCvalue) {
		this.rawCvalue = rawCvalue;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "priceType")
	public short getPriceType() {
		return priceType;
	}

	public void setPriceType(short priceType) {
		this.priceType = priceType;
	}

	public SalesItemVO ptv(SalesItemVO salesItemVO) {

		BeanUtil.copyProperties(this, salesItemVO, Arrays.asList("goods", "color", "format"));

		if (salesItemVO.getGoods() != null && getGoods() != null) getGoods().ptv(salesItemVO.getGoods());
		if (salesItemVO.getColor() != null && getColor() != null) getColor().ptv(salesItemVO.getColor());
		if (salesItemVO.getFormat() != null && getFormat() != null) getFormat().ptv(salesItemVO.getFormat());

		return salesItemVO;
	}

}
