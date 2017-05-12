package com.fanglin.inventory.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class CheckListVO implements java.io.Serializable {

	private static final long serialVersionUID = -141013481684201527L;

	private Long clId;
	
	private GoodsVO goods;
	
	private ColorVO color;
	
	private FormatVO format;
	
	private StorehouseVO storehouse;
	
	private Short type;
	
	private Float num;
	
	private Timestamp createTime;
	
	private UserVO createUser;

	public CheckListVO() {
		super();
	}

	public CheckListVO(GoodsVO goods, ColorVO color,FormatVO format,StorehouseVO storehouse, UserVO createUser) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
		this.storehouse = storehouse;
		this.createUser = createUser;
	}

	public Long getClId() {
		return this.clId;
	}

	public void setClId(Long clId) {
		this.clId = clId;
	}
	
	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
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

	public Short getType() {
		return this.type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Float getNum() {
		return this.num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserVO getCreateUser() {
		return createUser;
	}

	public void setCreateUser(UserVO createUser) {
		this.createUser = createUser;
	}

}