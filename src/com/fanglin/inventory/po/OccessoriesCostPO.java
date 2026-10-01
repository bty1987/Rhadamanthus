package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "occessoriescost", catalog = "inventory")
public class OccessoriesCostPO implements Serializable {

	private static final long serialVersionUID = 7990398717523266950L;

	public static final String COLUMN_STATUS_STR = "status";

	// 历史命名：这三个常量是 type 的取值（0车运费/1搬运费/2上楼费），不是 status
	public static final short STATUS_INIT_VEHICLEFREIGHT = 0;

	public static final short STATUS_INIT_HANDLINGFEE = 1;

	public static final short STATUS_INIT_UPSTAIRSFEE = 2;

	private long ocid;// 外辅费用ID

	private long oid;// 辅料单ID

	private int initPrice;

	private int price;// 金额

	private int cost;// 成本

	private short type;// 类型 , 0: 车运费 , 1: 搬运费 , 2: 上楼费

	private short status;

	public OccessoriesCostPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ocid")
	public long getOcid() {
		return ocid;
	}

	public void setOcid(long ocid) {
		this.ocid = ocid;
	}

	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "initPrice")
	public int getInitPrice() {
		return initPrice;
	}

	public void setInitPrice(int initPrice) {
		this.initPrice = initPrice;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "cost")
	public int getCost() {
		return cost;
	}

	public void setCost(int cost) {
		this.cost = cost;
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

	public OccessoriesCostPO init(long oid, int price, int cost, short type) {

		setOid(oid);
		setInitPrice(price);
		setPrice(price);
		setCost(cost);
		setType(type);

		return this;
	}

}
