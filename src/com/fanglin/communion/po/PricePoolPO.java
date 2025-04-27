package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.vo.PricePoolVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "pricePool", catalog = "communion")
public class PricePoolPO implements Serializable {

	private static final long serialVersionUID = -5902199266188258778L;

	public static final String COLUMN_PPID_STR = "ppid";

	public static final String COLUMN_GPID_STR = "goodsPool.gpid";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long ppid;

	private GoodsPoolPO goodsPool;

	private String name;

	private short type;

	private int purchase;

	private int selling;

	private int confine;

	private short ctype;

	private int cvalue;

	private short status;

	public PricePoolPO() {
		super();
	}

	public PricePoolPO(long ppid) {
		super();
		this.ppid = ppid;
	}

	public PricePoolPO(GoodsPoolPO goodsPool) {
		super();
		this.goodsPool = goodsPool;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "gpid", referencedColumnName = "gpid")
	public GoodsPoolPO getGoodsPool() {
		return goodsPool;
	}

	public void setGoodsPool(GoodsPoolPO goodsPool) {
		this.goodsPool = goodsPool;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "purchase")
	public int getPurchase() {
		return purchase;
	}

	public void setPurchase(int purchase) {
		this.purchase = purchase;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	public int getConfine() {
		return confine;
	}

	public void setConfine(int confine) {
		this.confine = confine;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public PricePoolVO ptv(PricePoolVO pricePoolVO) {

		BeanUtil.copyProperties(this, pricePoolVO, Arrays.asList("goodsPool"));

		if (pricePoolVO.getGoodsPool() != null && getGoodsPool() != null) getGoodsPool().ptv(pricePoolVO.getGoodsPool());

		return pricePoolVO;
	}

}
