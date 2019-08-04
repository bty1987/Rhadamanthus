package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.sales.po.SalesPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "salespayment", catalog = "payment")
public class SalesPaymentPO  implements Serializable{

	private static final long serialVersionUID = -6488725711320678781L;
	
	public static final String COLUMN_SALES_ORDERID_STR = "sales.orderId";
	
	public static final String COLUMN_SALES_SID_STR = "sales.sid";
	
	public static final String COLUMN_SALES_SALESMAN_USERID_STR = "salesman.userId";
	
	public static final String COLUMN_SALES_NO_STR = "sales.no";
	
	public static final String COLUMN_SALES_VILLAGE_NO_STR = "village.no";
	
	public static final short STATUS_INITIAL_INT = 0;
	
	public static final short STATUS_PAIDFOR_INT = 1;
	
	public static final short STATUS_CONFIRMED_INT = 2;
	
	public static final short TYPE_DEPOSIT_INT = 2;
	
	public static final short TYPE_REPLENISHMENT_INT = 3;
	
	public static final short TYPE_REFUNDS_INT = 4;
	
	public static final short TYPE_MAKEAREFUND_INT = 5;
	
	public static final short TYPE_VOUCHERREFUND_INT = 6;
	
	public static final short TYPE_DEPOSITREFUND_INT = 7;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_SID_STR ="sid";
	
	public static final String COLUMN_SRID_STR ="srId";
	
	public static final String COLUMN_COLLECTTIME_STR ="salesReceipt.collectTime";
	
	public static final String COLUMN_CONFIRMTIME_STR ="salesReceipt.confirmTime";
	
	public static final String COLUMN_TYPE_STR ="type";
	
	public static final short ADVANCETYPE_CONTRACT_INT = 1;
	
	public static final short ADVANCETYPE_ENGINEERING_INT = 2;
	
	public static final short ADVANCETYPE_MATERIAL_INT = 3;
	
	public static final short ADVANCETYPE_ZHENGLIN_INT = 4;
	
	private long spid;
	
	private SalesReceiptPO salesReceipt;

	private SalesPO sales;

	private short type;

	private short status;
	
	private String category;             

	private String brand;           

	private UserPO creater;
	
	private Timestamp createTime;
	
	private float referMoney;
	
	private int company;

	public SalesPaymentPO() {
		super();
	}
	
	public SalesPaymentPO(UserPO creater,SalesPO sales,SalesReceiptPO salesReceipt) {
		super();
		this.creater = creater;
		this.sales = sales;
		this.salesReceipt = salesReceipt;
	}
	
	public SalesPaymentPO(UserPO creater,SalesPO sales) {
		super();
		this.creater = creater;
		this.sales = sales;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) 
	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
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

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	
	@Column(name="createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@Column(name = "referMoney")
	public float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(float referMoney) {
		this.referMoney = referMoney;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "srid", referencedColumnName = "srid")
	public SalesReceiptPO getSalesReceipt() {
		return salesReceipt;
	}

	public void setSalesReceipt(SalesReceiptPO salesReceipt) {
		this.salesReceipt = salesReceipt;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
}
