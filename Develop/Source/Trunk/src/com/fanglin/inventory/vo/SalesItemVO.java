package com.fanglin.inventory.vo;

import java.io.Serializable;


public class SalesItemVO implements Serializable {

	private static final long serialVersionUID = -8723694814795039927L;

	private long siid;
	
	private long sid;
	
	private GoodsVO goods;
	
	private ColorVO color;
	
	private FormatVO format;
	
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

	public SalesItemVO() {
		super();
	}


	
	public SalesItemVO(GoodsVO goods, ColorVO color, FormatVO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}



	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
	}

	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public ColorVO getColor() {
		return color;
	}

	public void setColor(ColorVO color) {
		this.color = color;
	}

	public FormatVO getFormat() {
		return format;
	}

	public void setFormat(FormatVO format) {
		this.format = format;
	}

	public float getPurchase() {
		return purchase;
	}

	public void setPurchase(float purchase) {
		this.purchase = purchase;
	}

	public float getSelling() {
		return selling;
	}

	public void setSelling(float selling) {
		this.selling = selling;
	}

	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}

	public float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(float disPrice) {
		this.disPrice = disPrice;
	}

	public float getPostDis() {
		return postDis;
	}

	public void setPostDis(float postDis) {
		this.postDis = postDis;
	}

	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public short getRawCtype() {
		return rawCtype;
	}

	public void setRawCtype(short rawCtype) {
		this.rawCtype = rawCtype;
	}

	public float getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(float rawCvalue) {
		this.rawCvalue = rawCvalue;
	}

	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	public float getCvalue() {
		return cvalue;
	}

	public void setCvalue(float cvalue) {
		this.cvalue = cvalue;
	}
}
