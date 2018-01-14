package com.fanglin.inventory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "storehousestock", catalog = "inventory")
public class StorehouseStockPO implements java.io.Serializable {

	private static final long serialVersionUID = 730392365817913862L;
	
	public static final String COLUMN_SHID_STR = "storehouse.shId";
	
	public static final String COLUMN_MONTH_STR = "month";
	
	private long shsId;
	
	private StorehousePO storehouse;
	
	private String month;
	
	private float num;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "shsId")
	public long getShsId() {
		return this.shsId;
	}

	public void setShsId(long shsId) {
		this.shsId = shsId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shId", referencedColumnName = "shId")
	public StorehousePO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehousePO storehouse) {
		this.storehouse = storehouse;
	}

	@Column(name = "month")
	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

}