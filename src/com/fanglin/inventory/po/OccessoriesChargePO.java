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

import com.fanglin.inventory.vo.OccessoriesChargeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "occessoriescharge", catalog = "inventory")
public class OccessoriesChargePO implements Serializable {

	private static final long serialVersionUID = -1234567890123456789L;

	public static final String COLUMN_OID_STR = "oid";

	public static final String COLUMN_OIID_STR = "oiid";

	private long acid; // 主键ID

	private OccessoriesPO occessories; // 外辅单

	private OccessoriesItemPO occessoriesItem; // 外辅项

	private String name; // 费用名称

	private int price; // 价格（×1000）

	private int surplus; // 浮动额（×1000）

	private int num; // 数量

	public OccessoriesChargePO() {
		super();
	}

	public OccessoriesChargePO(long acid) {
		super();
		this.acid = acid;
	}

	public OccessoriesChargePO(OccessoriesPO occessories) {
		super();
		this.occessories = occessories;
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
	@JoinColumn(name = "oid", referencedColumnName = "oid")
	public OccessoriesPO getOccessories() {
		return occessories;
	}

	public void setOccessories(OccessoriesPO occessories) {
		this.occessories = occessories;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oiid", referencedColumnName = "oiid")
	public OccessoriesItemPO getOccessoriesItem() {
		return occessoriesItem;
	}

	public void setOccessoriesItem(OccessoriesItemPO occessoriesItem) {
		this.occessoriesItem = occessoriesItem;
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

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	/**
	 * PO 转 VO
	 */
	public OccessoriesChargeVO ptv(OccessoriesChargeVO occessoriesChargeVO) {
		BeanUtil.copyProperties(this, occessoriesChargeVO, Arrays.asList("occessories", "occessoriesItem"));

		if (occessoriesChargeVO.getOccessories() != null && getOccessories() != null) {
			getOccessories().ptv(occessoriesChargeVO.getOccessories());
		}

		if (occessoriesChargeVO.getOccessoriesItem() != null && getOccessoriesItem() != null) {
			getOccessoriesItem().ptv(occessoriesChargeVO.getOccessoriesItem());
		}

		return occessoriesChargeVO;
	}

}
