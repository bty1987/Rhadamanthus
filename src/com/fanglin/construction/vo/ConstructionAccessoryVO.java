package com.fanglin.construction.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.AoodsVO;

public class ConstructionAccessoryVO implements Serializable{

	private static final long serialVersionUID = 4912963491237821982L;
	
	private Long caid;
	
	private Long cid;
	
	private AoodsVO aoods;
	
	private Short checkup;
	
	private Long numLimit;
	
	private Integer num;
	
	private Long total;
	
	private Long gid;
	
	private String name;
	
	private String orderId;

	public ConstructionAccessoryVO() {
		super();
	}

	public ConstructionAccessoryVO(AoodsVO aoods) {
		super();
		this.aoods = aoods;
	}

	public Long getCaid() {
		return caid;
	}

	public void setCaid(Long caid) {
		this.caid = caid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}
	
	public AoodsVO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsVO aoods) {
		this.aoods = aoods;
	}

	public Short getCheckup() {
		return checkup;
	}

	public void setCheckup(Short checkup) {
		this.checkup = checkup;
	}

	public Long getNumLimit() {
		return numLimit;
	}

	public void setNumLimit(Long numLimit) {
		this.numLimit = numLimit;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
}
