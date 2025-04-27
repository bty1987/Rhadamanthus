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

import com.fanglin.communion.vo.FormatPoolVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "formatPool", catalog = "communion")
public class FormatPoolPO implements Serializable {

	private static final long serialVersionUID = -1096565738615753599L;

	public static final String COLUMN_GPID_STR = "goodsPool.gpid";

	public static final String COLUMN_INFO_STR = "info";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long fpid;

	private GoodsPoolPO goodsPool;

	private String info;

	private short status;

	public FormatPoolPO() {
		super();
	}

	public FormatPoolPO(long fpid) {
		super();
		this.fpid = fpid;
	}

	public FormatPoolPO(GoodsPoolPO goodsPool) {
		super();
		this.goodsPool = goodsPool;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fpid")
	public long getFpid() {
		return fpid;
	}

	public void setFpid(long fpid) {
		this.fpid = fpid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "gpid", referencedColumnName = "gpid")
	public GoodsPoolPO getGoodsPool() {
		return goodsPool;
	}

	public void setGoodsPool(GoodsPoolPO goodsPool) {
		this.goodsPool = goodsPool;
	}

	@Column(name = "info")
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public FormatPoolVO ptv(FormatPoolVO formatPoolVO) {

		BeanUtil.copyProperties(this, formatPoolVO, Arrays.asList("goodsPool"));

		if (formatPoolVO.getGoodsPool() != null && getGoodsPool() != null) getGoodsPool().ptv(formatPoolVO.getGoodsPool());

		return formatPoolVO;
	}

}
