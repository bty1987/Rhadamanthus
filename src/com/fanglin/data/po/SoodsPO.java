package com.fanglin.data.po;

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

import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "soods", catalog = "data")
public class SoodsPO implements Serializable {

	private static final long serialVersionUID = 7368457103806437597L;

	public static final String COLUMN_NAME_STR = "goods.name";

	public static final String COLUMN_BRAND_STR = "goods.brand";

	public static final String COLUMN_CATEGORY_STR = "goods.category";

	public static final short STATUS_VALID_INT = 0;

	public static final short STATUS_INVALID_INT = 1;

	private long sid;

	private String name;

	private GoodsBO goods;

	private String format;

	private int num;

	private int selling;

	private int cost;

	private int balance;

	private String path;

	private short status;

	private short type;

	private int company;

	public SoodsPO() {
		super();
	}

	public SoodsPO(long sid) {
		super();
		this.sid = sid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsBO getGoods() {
		return goods;
	}

	public void setGoods(GoodsBO goods) {
		this.goods = goods;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "cost")
	public int getCost() {
		return cost;
	}

	public void setCost(int cost) {
		this.cost = cost;
	}

	@Column(name = "balance")
	public int getBalance() {
		return balance;
	}

	public void setBalance(int balance) {
		this.balance = balance;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public SoodsVO ptv(SoodsVO soodsVO) {

		BeanUtil.copyProperties(this, soodsVO, Arrays.asList("goods"));

		if (soodsVO.getGoods() != null && getGoods() != null) BeanUtil.copyProperties(getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

		return soodsVO;
	}

}
