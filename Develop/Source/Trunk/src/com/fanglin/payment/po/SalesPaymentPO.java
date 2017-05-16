package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.inventory.po.SalesPO;
import com.fanglin.personel.po.UserPO;


@Entity
@Table(name = "salespayment", catalog = "inventory")
public class SalesPaymentPO  implements Serializable{

	private static final long serialVersionUID = -6488725711320678781L;
	
	public static final String COLUMN_SALES_ORDERID_STR = "sales.orderId";
	
	public static final String COLUMN_SALES_SALESMAN_USERNAME_STR = "salesman.currentName";
	
	public static final String COLUMN_SALES_NO_STR = "sales.no";
	
	public static final String COLUMN_SALES_VILLAGE_VILLAGENAME_STR = "village.villageName";
	
	public static final Short COLUMN_SALES_INITIALSTATUS_INT = 0;            //销售单初始状态
	
	public static final Short COLUMN_SALES_PAIDFORSTATUS_INT = 1;            //销售单已收款状态
	
	public static final Short COLUMN_SALES_CONFIRMEDSTATUS_INT = 2;          //销售单已确认状态
	
	public static final Short COLUMN_DTYPE_INT = 7;                          //定金退款
	
	public static final Short COLUMN_BTYPE_INT = 5;                          //补款退款
	
	public static final Short COLUMN_JTYPE_INT = 6;                          //券退款
	
	public static final Short COLUMN_RTYPE_INT = 4;                          //退款
	
	public static final String COLUMN_SALES_STATUS_STR = "status";        
	
	public static final String COLUMN_SID_STR ="sid";
	
	public static final String COLUMN_SRID_STR ="srId";
	
	public static final String COLUMN_COLLECTTIME_STR ="salesReceipt.collectTime";
	
	public static final String COLUMN_CONFIRMTIME_STR ="salesReceipt.confirmTime";
	
	private Long spid;                    //款项ID

	private SalesPO sales;                //销售单ID

	private Short type;                   //款项类型

	private Short status;                 //状态

	private String category;              //品类

	private String brand;                 //品牌

	private UserPO creater;               //创建人
	
	private String createrName;           //创建人姓名

	private Float referMoney;             //应收金额
	
	private SalesReceiptPO salesReceipt;  //收据ID

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
	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
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
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createrName")
	public String getCreaterName() {
		return createrName;
	}

	public void setCreaterName(String createrName) {
		this.createrName = createrName;
	}

	@Column(name = "referMoney")
	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
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
	
}
