package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.NoodsVO;

public class CormoodVO implements Serializable {

	private static final long serialVersionUID = 6581325512288639785L;

	private Long cgid;

	private Long qfid;

	private String name;

	private NoodsVO noods;

	private String normunit;

	private Integer normnum;

	private String storeunit;

	private Integer storenum;

	private Integer price;

	private Short status;

	public CormoodVO() {
		super();
	}

	public CormoodVO(NoodsVO noods) {
		super();
		this.noods = noods;
	}

	public Long getCgid() {
		return cgid;
	}

	public void setCgid(Long cgid) {
		this.cgid = cgid;
	}

	public Long getQfid() {
		return qfid;
	}

	public void setQfid(Long qfid) {
		this.qfid = qfid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public NoodsVO getNoods() {
		return noods;
	}

	public void setNoods(NoodsVO noods) {
		this.noods = noods;
	}

	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	public Integer getNormnum() {
		return normnum;
	}

	public void setNormnum(Integer normnum) {
		this.normnum = normnum;
	}

	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	public Integer getStorenum() {
		return storenum;
	}

	public void setStorenum(Integer storenum) {
		this.storenum = storenum;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
