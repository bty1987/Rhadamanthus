package com.fanglin.sales.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;

public class SalesItemVO implements Serializable {

	private static final long serialVersionUID = -8723694814795039927L;

	private Long siid;

	private Long sid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private Integer purchase;

	private Integer selling;

	private Integer discount;

	private Integer disPrice;

	private Integer postDis;

	private Integer price;

	private Long num;

	private Long initnum;

	private Long punum;
	
	private Long xgnum;

	private Long total;

	private String comment;

	private Short rawCtype;

	private Integer rawCvalue;

	private Short ctype;

	private Integer cvalue;

	private Short priceType;

	private Long psiid;

	private Short type;

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

	public Integer getPurchase() {
		return purchase;
	}

	public void setPurchase(Integer purchase) {
		this.purchase = purchase;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(Integer disPrice) {
		this.disPrice = disPrice;
	}

	public Integer getPostDis() {
		return postDis;
	}

	public void setPostDis(Integer postDis) {
		this.postDis = postDis;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Long getNum() {
		return num;
	}

	public void setNum(Long num) {
		this.num = num;
	}

	public Long getInitnum() {
		return initnum;
	}

	public void setInitnum(Long initnum) {
		this.initnum = initnum;
	}

	public Long getPunum() {
		return punum;
	}

	public void setPunum(Long punum) {
		this.punum = punum;
	}

	public Long getXgnum() {
		return xgnum;
	}

	public void setXgnum(Long xgnum) {
		this.xgnum = xgnum;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
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

	public Integer getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(Integer rawCvalue) {
		this.rawCvalue = rawCvalue;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

	public Short getPriceType() {
		return priceType;
	}

	public void setPriceType(Short priceType) {
		this.priceType = priceType;
	}

	public Long getPsiid() {
		return psiid;
	}

	public void setPsiid(Long psiid) {
		this.psiid = psiid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}
}
