package com.fanglin.sales.vo;

import java.io.Serializable;

import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;


public class SalesItemVO implements Serializable {

	private static final long serialVersionUID = -8723694814795039927L;

	private Long siid;
	
	private Long sid;
	
	private GoodsVO goods;
	
	private ColorVO color;
	
	private FormatVO format;
	
	private Float purchase;
	
	private Float selling;
	
	private	Float discount;
	
	private	Float disPrice;
	
	private	Float postDis;
	
	private	Float price;
	
	private Float xgnum;
	
	private Float punum;
	
	private	Float num;
	
	private	Float total;
	
	private	String comment;
	
	private	Short rawCtype;
	
	private	Float rawCvalue;
	
	private	Short ctype;
	
	private	Float cvalue;

	public SalesItemVO() {
		super();
	}
	
	public SalesItemVO(GoodsVO goods, ColorVO color, FormatVO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
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

	public Float getPurchase() {
		return purchase;
	}

	public void setPurchase(Float purchase) {
		this.purchase = purchase;
	}

	public Float getSelling() {
		return selling;
	}

	public void setSelling(Float selling) {
		this.selling = selling;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
		this.discount = discount;
	}

	public Float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(Float disPrice) {
		this.disPrice = disPrice;
	}

	public Float getPostDis() {
		return postDis;
	}

	public void setPostDis(Float postDis) {
		this.postDis = postDis;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Float getXgnum() {
		return xgnum;
	}

	public void setXgnum(Float xgnum) {
		this.xgnum = xgnum;
	}

	public Float getPunum() {
		return punum;
	}

	public void setPunum(Float punum) {
		this.punum = punum;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getRawCtype() {
		return rawCtype;
	}

	public void setRawCtype(Short rawCtype) {
		this.rawCtype = rawCtype;
	}

	public Float getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(Float rawCvalue) {
		this.rawCvalue = rawCvalue;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Float getCvalue() {
		return cvalue;
	}

	public void setCvalue(Float cvalue) {
		this.cvalue = cvalue;
	}

}
