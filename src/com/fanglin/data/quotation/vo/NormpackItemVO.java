package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.NoodsVO;

public class NormpackItemVO implements Serializable {

	private static final long serialVersionUID = 3442779774850710276L;

	private long npiid;

	private long npid;

	private String name;

	private NoodsVO noods;

	private String normunit;// 定额单位

	private Integer normnum;// 定额数量

	private String storeunit;// 库房单位

	private Integer storenum;// 库房数量

	private int price;

	public NormpackItemVO() {
		super();
	}

	public NormpackItemVO(NoodsVO noods) {
		super();
		this.noods = noods;
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

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

}
