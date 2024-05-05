package com.fanglin.inventory.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;

public class AccessoriesItemVO implements Serializable {

	private static final long serialVersionUID = -4448576124164007315L;

	private Long aiid;

	private Long aid;

	private Long miid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private StorehouseVO storehouse;

	private Integer selling;

	private Integer outprice;

	private Integer num;

	private Integer surplus;

	private Short checkup;

	private Long caid;

	private Long nid;

	private Short schedule;

	private Long total;

	public AccessoriesItemVO() {
		super();
	}

	public AccessoriesItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public Long getAiid() {
		return aiid;
	}

	public void setAiid(Long aiid) {
		this.aiid = aiid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getMiid() {
		return miid;
	}

	public void setMiid(Long miid) {
		this.miid = miid;
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

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getOutprice() {
		return outprice;
	}

	public void setOutprice(Integer outprice) {
		this.outprice = outprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

	public Short getCheckup() {
		return checkup;
	}

	public void setCheckup(Short checkup) {
		this.checkup = checkup;
	}

	public Long getCaid() {
		return caid;
	}

	public void setCaid(Long caid) {
		this.caid = caid;
	}

	public Long getNid() {
		return nid;
	}

	public void setNid(Long nid) {
		this.nid = nid;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

}
