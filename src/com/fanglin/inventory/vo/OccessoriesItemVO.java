package com.fanglin.inventory.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.GoodsVO;

public class OccessoriesItemVO implements Serializable {

	private static final long serialVersionUID = -8219707602421923655L;

	private Long oiid;
	
	private Long oid;
	
	private GoodsVO goods;
	
	private Integer num;
	
	public OccessoriesItemVO(){
		super();
	}

	public OccessoriesItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public Long getOiid() {
		return oiid;
	}

	public void setOiid(Long oiid) {
		this.oiid = oiid;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}
}
