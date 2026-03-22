package com.fanglin.inventory.po;

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

import com.fanglin.data.po.AoodsPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "occessoriesItem", catalog = "inventory")
public class OccessoriesItemPO implements Serializable {

	private static final long serialVersionUID = 235550936041004117L;

	private long oiid;

	private long oid;

	private GoodsPO goods;

	private AoodsPO aoods;

	private int num;

	private int sennum; // 送货数量

	private int recnum; // 到货数量

	private int rbalance;// 原结算价

	private int vbalance;// 结算价

	@Column(name = "rbalance")
	public int getRbalance() {
		return rbalance;
	}

	public void setRbalance(int rbalance) {
		this.rbalance = rbalance;
	}

	@Column(name = "vbalance")
	public int getVbalance() {
		return vbalance;
	}

	public void setVbalance(int vbalance) {
		this.vbalance = vbalance;
	}

	public OccessoriesItemPO() {
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public AoodsPO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsPO aoods) {
		this.aoods = aoods;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "sennum")
	public int getSennum() {
		return sennum;
	}

	public void setSennum(Integer sennum) {
		this.sennum = sennum;
	}

	@Column(name = "recnum")
	public int getRecnum() {
		return recnum;
	}

	public void setRecnum(int recnum) {
		this.recnum = recnum;
	}

	public OccessoriesItemPO init(long oid, long gid, int num) {

		setOid(oid);
		setGoods(new GoodsPO(gid));
		setNum(num);

		return this;
	}

	public OccessoriesItemVO ptv(OccessoriesItemVO occessoriesItemVO) {

		BeanUtil.copyProperties(this, occessoriesItemVO, Arrays.asList("goods", "aoods"));

		if (occessoriesItemVO.getGoods() != null && getGoods() != null) BeanUtil.copyProperties(getGoods(), occessoriesItemVO.getGoods(), Arrays.asList("accessoriesType"));
		if (occessoriesItemVO.getGoods() != null && occessoriesItemVO.getGoods().getAccessoriesType() != null && getGoods() != null && getGoods().getAccessoriesType() != null) getGoods().getAccessoriesType().ptv(occessoriesItemVO.getGoods().getAccessoriesType());

		if (occessoriesItemVO.getAoods() != null && getAoods() != null) getAoods().ptv(occessoriesItemVO.getAoods());

		return occessoriesItemVO;
	}

}
