package com.fanglin.inventory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "purchaseamount", catalog = "inventory")
public class PurchaseAmountPO implements java.io.Serializable {

	private static final long serialVersionUID = 721748056254330762L;
	
	public static final String COLUMN_MONTH_STR = "month";
	
	private long paId;
	
	private String month;
	
	private float money;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "paId")
	public long getPaId() {
		return this.paId;
	}

	public void setPaId(long paId) {
		this.paId = paId;
	}

	@Column(name = "month")
	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	@Column(name = "money")
	public float getMoney() {
		return this.money;
	}

	public void setMoney(float money) {
		this.money = money;
	}

}