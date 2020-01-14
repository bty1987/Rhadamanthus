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

import com.fanglin.data.po.GoodsPO;

@Entity
@Table(name = "occessoriesItem", catalog = "inventory")
public class OccessoriesItemPO implements Serializable {

	private static final long serialVersionUID = 235550936041004117L;

	private long oiid;
	
	private long oid;
	
	private GoodsPO goods;
	
	private int num;
	
	public OccessoriesItemPO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oiid")
	public long getOiid() {
		return oiid;
	}

	public void setOiid(long oiid) {
		this.oiid = oiid;
	}

	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}
	
	public OccessoriesItemPO init(long oid, long gid, int num){
		
		setOid(oid);
		setGoods(new GoodsPO(gid));
		setNum(num);
		
		return this;
	}
	
}
