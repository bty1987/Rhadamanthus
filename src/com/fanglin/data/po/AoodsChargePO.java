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

import com.fanglin.data.material.vo.AoodsChargeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "aoodscharge", catalog = "data")
public class AoodsChargePO implements Serializable {

	private static final long serialVersionUID = -1234567890123456789L;

	public static final String COLUMN_AID_STR = "aoods.aid";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short STATUS_ENABLE_SHORT = 0; // 启用

	public static final short STATUS_DISABLE_SHORT = 1; // 禁用

	public static final short TYPE_COMMON_SHORT = 0; // 通用

	public static final short TYPE_UPGRADE_SHORT = 1; // 超阶

	private long acid; // 主键ID

	private AoodsPO aoods; // 关联的辅材

	private String name; // 费用名称

	private int price; // 价格（厘，×1000）

	private int surplus; // 浮动额（厘，×1000）

	private short type; // 类型：0-通用，1-超阶

	private short status; // 状态：0-启用，1-禁用

	private int sort; // 排序

	public AoodsChargePO() {
		super();
	}

	public AoodsChargePO(long acid) {
		super();
		this.acid = acid;
	}

	public AoodsChargePO(AoodsPO aoods) {
		super();
		this.aoods = aoods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acid")
	public long getAcid() {
		return acid;
	}

	public void setAcid(long acid) {
		this.acid = acid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public AoodsPO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsPO aoods) {
		this.aoods = aoods;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "sort")
	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	/**
	 * PO 转 VO
	 */
	public AoodsChargeVO ptv(AoodsChargeVO aoodsChargeVO) {
		BeanUtil.copyProperties(this, aoodsChargeVO, Arrays.asList("aoods"));

		if (aoodsChargeVO.getAoods() != null && getAoods() != null) {
			getAoods().ptv(aoodsChargeVO.getAoods());
		}

		return aoodsChargeVO;
	}

}
