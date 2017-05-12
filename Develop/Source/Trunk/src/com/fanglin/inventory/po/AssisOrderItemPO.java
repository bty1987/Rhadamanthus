package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
@Entity
@Table(name = "assisorderitem", catalog = "inventory")
public class AssisOrderItemPO implements Serializable{

	private static final long serialVersionUID = -7755475355194951377L;
	
	public static final String COLUMN_AOID_STR = "aoid";
	
	public static final String COLUMN_AOIDS_STR = "aoids";
	
	private Long aoiid;
	
	private Long aoid;
	
	private GoodsPO goods;
	
	private Float num;
	
	public AssisOrderItemPO() {
		super();
	}

	public AssisOrderItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) //主键由数据库自动生成
	@Column(name = "aoiid")
	public Long getAoiid() {
		return aoiid;
	}

	public void setAoiid(Long aoiid) {
		this.aoiid = aoiid;
	}
	
	@Column(name = "aoid")
	public Long getAoid() {
		return aoid;
	}

	public void setAoid(Long aoid) {
		this.aoid = aoid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "num")
	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

}
