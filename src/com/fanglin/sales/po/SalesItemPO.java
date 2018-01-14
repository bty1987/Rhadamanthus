package com.fanglin.sales.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;

@Entity
@Table(name = "salesitem", catalog = "inventory")
public class SalesItemPO implements Serializable {

	private static final long serialVersionUID = 317677385751139684L;
	
	public static final String COLUMN_SID_STR ="sid";
	
	public static final String COLUMN_SIID_STR ="siid";
	
	public static final short CTYPE_RESERVEPRICE_INT = 0;
	
	public static final short CTYPE_POINT_INT = 1;
	
	private long siid;
	
	private long sid;
	
	private GoodsPO goods;
	
	private ColorPO color;
	
	private FormatPO format;
	
	private float purchase;
	
	private float selling;
	
	private	float discount;
	
	private	float disPrice;
	
	private	float postDis;
	
	private	float price;
	
	private	float num;
	
	private	float total;
	
	private	String comment;
	
	private	short rawCtype;
	
	private	float rawCvalue;
	
	private	short ctype;
	
	private	float cvalue;

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
	@Column(name="siid")
	public long getSiid() {
		return siid;
	}


	public void setSiid(long siid) {
		this.siid = siid;
	}

	@Column(name="sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "gId", referencedColumnName="gId")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cId", referencedColumnName="cId")
	public ColorPO getColor() {
		return color;
	}

	public void setColor(ColorPO color) {
		this.color = color;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "fId", referencedColumnName="fId")
	public FormatPO getFormat() {
		return format;
	}

	public void setFormat(FormatPO format) {
		this.format = format;
	}
	
	@Column(name="purchase")
	public float getPurchase() {
		return purchase;
	}

	public void setPurchase(float purchase) {
		this.purchase = purchase;
	}
	
	@Column(name="selling")
	public float getSelling() {
		return selling;
	}

	public void setSelling(float selling) {
		this.selling = selling;
	}
	
	@Column(name="discount")
	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}
	
	@Column(name="disprice")
	public float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(float disPrice) {
		this.disPrice = disPrice;
	}
	
	@Column(name="postdis")
	public float getPostDis() {
		return postDis;
	}

	public void setPostDis(float postDis) {
		this.postDis = postDis;
	}
	
	@Column(name="price")
	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}
	
	@Column(name="num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}
	
	@Column(name="total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}
	
	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	@Column(name="rawctype")
	public short getRawCtype() {
		return rawCtype;
	}

	public void setRawCtype(short rawCtype) {
		this.rawCtype = rawCtype;
	}
	
	@Column(name="rawcvalue")
	public float getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(float rawCvalue) {
		this.rawCvalue = rawCvalue;
	}
	
	@Column(name="ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}
	
	@Column(name="cvalue")
	public float getCvalue() {
		return cvalue;
	}

	public void setCvalue(float cvalue) {
		this.cvalue = cvalue;
	}

}
