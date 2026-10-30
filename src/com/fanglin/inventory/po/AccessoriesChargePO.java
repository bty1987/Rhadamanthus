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

import com.fanglin.inventory.vo.AccessoriesChargeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "accessoriescharge", catalog = "inventory")
public class AccessoriesChargePO implements Serializable {

	private static final long serialVersionUID = -1234567890123456790L;

	public static final String COLUMN_AID_STR = "aid";

	public static final String COLUMN_AIID_STR = "aiid";

	private long acid; // 主键ID

	private AccessoriesPO accessories; // 辅料单

	private AccessoriesItemPO accessoriesItem; // 辅料项

	private String name; // 费用名称

	private long price; // 单价（厘，×1000）

	private long surplus; // 浮动额（厘，×1000）

	private int num; // 数量

	public AccessoriesChargePO() {
		super();
	}

	public AccessoriesChargePO(long acid) {
		super();
		this.acid = acid;
	}

	public AccessoriesChargePO(AccessoriesPO accessories) {
		super();
		this.accessories = accessories;
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
	public AccessoriesPO getAccessories() {
		return accessories;
	}

	public void setAccessories(AccessoriesPO accessories) {
		this.accessories = accessories;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aiid", referencedColumnName = "aiid")
	public AccessoriesItemPO getAccessoriesItem() {
		return accessoriesItem;
	}

	public void setAccessoriesItem(AccessoriesItemPO accessoriesItem) {
		this.accessoriesItem = accessoriesItem;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "price")
	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	@Column(name = "surplus")
	public long getSurplus() {
		return surplus;
	}

	public void setSurplus(long surplus) {
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
	public AccessoriesChargeVO ptv(AccessoriesChargeVO accessoriesChargeVO) {
		BeanUtil.copyProperties(this, accessoriesChargeVO, Arrays.asList("accessories", "accessoriesItem"));

		if (accessoriesChargeVO.getAccessories() != null && getAccessories() != null) {
			getAccessories().ptv(accessoriesChargeVO.getAccessories());
		}

		if (accessoriesChargeVO.getAccessoriesItem() != null && getAccessoriesItem() != null) {
			getAccessoriesItem().ptv(accessoriesChargeVO.getAccessoriesItem());
		}

		return accessoriesChargeVO;
	}

}
