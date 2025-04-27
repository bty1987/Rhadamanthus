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

import com.fanglin.communion.vo.ColorPoolVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "colorPool", catalog = "communion")
public class ColorPoolPO implements Serializable {

	private static final long serialVersionUID = -1762514755081817377L;

	public static final String COLUMN_GPID_STR = "goodsPool.gpid";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long cpid;

	private GoodsPoolPO goodsPool;

	private String name;

	private short status;

	public ColorPoolPO() {
		super();
	}

	public ColorPoolPO(long cpid) {
		super();
		this.cpid = cpid;
	}

	public ColorPoolPO(GoodsPoolPO goodsPool) {
		super();
		this.goodsPool = goodsPool;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public ColorPoolVO ptv(ColorPoolVO colorPoolVO) {

		BeanUtil.copyProperties(this, colorPoolVO, Arrays.asList("goodsPool"));

		if (colorPoolVO.getGoodsPool() != null && getGoodsPool() != null) getGoodsPool().ptv(colorPoolVO.getGoodsPool());

		return colorPoolVO;
	}

}
