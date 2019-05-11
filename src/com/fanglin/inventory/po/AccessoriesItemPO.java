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
@Table(name = "accessoriesitem", catalog = "inventory")
public class AccessoriesItemPO implements Serializable {

	private static final long serialVersionUID = -7755475355194951377L;

	public static final String COLUMN_AOID_STR = "aid";

	public static final String COLUMN_AOIDS_STR = "aids";

	private long aiid;

	private long aid;

	private GoodsPO goods;
	
	private float selling;

	private float num;
	
	private float surplus;

	public AccessoriesItemPO() {
		super();
	}

	public AccessoriesItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aiid")
	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "selling")
	public float getSelling() {
		return selling;
	}

	public void setSelling(float selling) {
		this.selling = selling;
	}

	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}
	
	@Column(name = "surplus")
	public float getSurplus() {
		return surplus;
	}

	public void setSurplus(float surplus) {
		this.surplus = surplus;
	}

	public AccessoriesItemPO init(long aid, long gid, float selling, float num){
		
		setAid(aid);
		
		setGoods(new GoodsPO(gid));
		
		setSelling(selling);
		setNum(num);
		setSurplus(num);
		
		return this;
	}

}
