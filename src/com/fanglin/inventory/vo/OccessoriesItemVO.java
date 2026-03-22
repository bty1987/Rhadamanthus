package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.util.List;

import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.material.vo.GoodsVO;

public class OccessoriesItemVO implements Serializable {

	private static final long serialVersionUID = -8219707602421923655L;

	private Long oiid;

	private Long oid;

	private GoodsVO goods;

	private AoodsVO aoods;

	private Integer num;

	private Integer sennum; //送货数量

	private Integer recnum; //到货数量

	private Integer rbalance;//原结算价

	private Integer vbalance;//结算价

	private List<OccessoriesChargeVO> occessoriesCharges; // 外辅费用列表
	
	public Integer getRbalance() {
		return rbalance;
	}

	public void setRbalance(Integer rbalance) {
		this.rbalance = rbalance;
	}

	public Integer getVbalance() {
		return vbalance;
	}

	public void setVbalance(Integer vbalance) {
		this.vbalance = vbalance;
	}

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

	public AoodsVO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsVO aoods) {
		this.aoods = aoods;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getSennum() {
		return sennum;
	}

	public void setSennum(Integer sennum) {
		this.sennum = sennum;
	}

	public Integer getRecnum() {
		return recnum;
	}

	public void setRecnum(Integer recnum) {
		this.recnum = recnum;
	}

	public List<OccessoriesChargeVO> getOccessoriesCharges() {
		return occessoriesCharges;
	}

	public void setOccessoriesCharges(List<OccessoriesChargeVO> occessoriesCharges) {
		this.occessoriesCharges = occessoriesCharges;
	}
}
