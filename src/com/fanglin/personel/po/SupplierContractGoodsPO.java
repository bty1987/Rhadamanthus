package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.GoodsPO;
import com.fanglin.personel.vo.SupplierContractGoodsVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "suppliercontractgoods", catalog = "communion")
public class SupplierContractGoodsPO implements java.io.Serializable {

	private static final long serialVersionUID = -9071186016137154118L;

	private long scgid;

	private long scid;

	private GoodsPO goods;

	private int price;

	private int balance;

	public SupplierContractGoodsPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	public SupplierContractGoodsPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "scgid")
	public long getScgid() {
		return scgid;
	}

	public void setScgid(long scgid) {
		this.scgid = scgid;
	}

	@Column(name = "scid")
	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "balance")
	public int getBalance() {
		return balance;
	}

	public void setBalance(int balance) {
		this.balance = balance;
	}

	public SupplierContractGoodsVO ptv(SupplierContractGoodsVO supplierContractGoodsVO) {

		BeanUtil.copyProperties(this, supplierContractGoodsVO, Arrays.asList("goods"));

		if (supplierContractGoodsVO.getGoods() != null) BeanUtil.copyProperties(getGoods(), supplierContractGoodsVO.getGoods(), Arrays.asList("accessoriesType", "onekind", "twokind", "thrkind"));

		return supplierContractGoodsVO;
	}
}
