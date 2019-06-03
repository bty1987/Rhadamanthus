package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class AwardRecordVO implements Serializable {

	private static final long serialVersionUID = 1819823248528353629L;

	private int arid;
	
	private String orderId;

	private AwardStockVO awardStock;

	private Short type;
	
	private Short onetype;
	
	private Short subtype;
	
	private Short isStock;

	private Float num;

	private Float totalPrice;

	private Float unitPrice;

	private UserVO creater;

	private Timestamp operateTime;

	private String content;
	
	public AwardRecordVO(AwardStockVO awardStock, UserVO creater) {
		super();
		this.awardStock = awardStock;
		this.creater = creater;
	}

	public AwardRecordVO() {
		super();
	}

	public int getArid() {
		return arid;
	}

	public void setArid(int arid) {
		this.arid = arid;
	}
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public AwardStockVO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockVO awardStock) {
		this.awardStock = awardStock;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}
	
	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public Short getOnetype() {
		return onetype;
	}

	public void setOnetype(Short onetype) {
		this.onetype = onetype;
	}
	
	public Short getIsStock() {
		return isStock;
	}

	public void setIsStock(Short isStock) {
		this.isStock = isStock;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Float totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}
	
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}
	
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	
}