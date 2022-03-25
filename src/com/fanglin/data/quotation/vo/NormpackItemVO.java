package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.GoodsVO;


public class NormpackItemVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private long npiid;

	private long npid;

	private GoodsVO goods;

	private String normunit;// 定额单位

	private Integer normnum;// 定额数量
	
	private String storeunit;// 库房单位

	private Integer storenum;// 库房数量

	public NormpackItemVO() {
		super();
	}
	
	public NormpackItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public long getNpiid() {
		return npiid;
	}

	public void setNpiid(long npiid) {
		this.npiid = npiid;
	}

	public long getNpid() {
		return npid;
	}

	public void setNpid(long npid) {
		this.npid = npid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
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

}
