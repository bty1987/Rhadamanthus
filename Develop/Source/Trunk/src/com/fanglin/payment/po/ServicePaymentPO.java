package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "servicepayment", catalog = "payment")
public class ServicePaymentPO  implements java.io.Serializable {

	private static final long serialVersionUID = 5195595430982438028L;
	
	public static final String COLUMN_ORDERID_STR = "decorationOrder.orderId";
	
	public static final String COLUMN_DESIGNER_STR = "designer.userName";
	
	public static final String COLUMN_VILLAGE_VILLAGENAME_STR = "village.villageName";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short COLUMN_INITIALSTATUS_INT = 0;
	
	public static final short COLUMN_STYPE_INT = 0;
	
	public static final short COLUMN_TTYPE_INT = 1;
	
	public static final short COLUMN_PAIDFORSTATUS_INT = 1; 
	
	public static final short COLUMN_CONFIRMEDSTATUS_INT = 2; 
	
	public static final float COLUMN_RATIO_STR = 1.1f; 
	
	public static final float COLUMN_MONEY_STR = 0f; 
	
	private long spid;                    //款项ID
	
	private DecorationOrderPO decorationOrder;    //订单编号
	
	private short type;                   //类型 ,0: 收款,1: 退款
	
	private int pid;                      //预付款款项ID
	
	private short status;                 //状态,0: 初始,1: 已收款,2: 已确认
	
	private UserPO creater;               //创建人ID
	
	private UserPO collecter;             //收款人ID
	
	private UserPO confirmer;             //确认人ID
	
	private String createrName;           //创建人姓名
	
	private String collecterName;         //收款人姓名
	
	private String confirmerName;         //确认人姓名
	
	private Timestamp createTime;         //创建时间
	
	private Timestamp collcetTime;        //收款时间
	
	private Timestamp confirmTime;        //确认时间
	
	private float serviceMoney;           //服务费金额
	
	private float advanceMoney;           //预付款金额
	
	private String des;                   //说明
	
	private ServiceReceiptPO serviceReceipt;  //收据ID
	
	public ServicePaymentPO() {
		super();
	}
	
	public ServicePaymentPO(DecorationOrderPO decorationOrder) {
		super();
		this.decorationOrder = decorationOrder;
	}
	
	public ServicePaymentPO(UserPO creater,DecorationOrderPO decorationOrder) {
		super();
		this.creater = creater;
		this.decorationOrder = decorationOrder;
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
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}
	
	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "pid")
	public int getPid() {
		return pid;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cluid", referencedColumnName = "uid")
	public UserPO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserPO collecter) {
		this.collecter = collecter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cfuid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@Column(name = "createrName")
	public String getCreaterName() {
		return createrName;
	}

	public void setCreaterName(String createrName) {
		this.createrName = createrName;
	}

	@Column(name = "collecterName")
	public String getCollecterName() {
		return collecterName;
	}

	public void setCollecterName(String collecterName) {
		this.collecterName = collecterName;
	}

	@Column(name = "confirmerName")
	public String getConfirmerName() {
		return confirmerName;
	}

	public void setConfirmerName(String confirmerName) {
		this.confirmerName = confirmerName;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "collectTime")
	public Timestamp getCollcetTime() {
		return collcetTime;
	}

	public void setCollcetTime(Timestamp collcetTime) {
		this.collcetTime = collcetTime;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "serviceMoney")
	public float getServiceMoney() {
		return serviceMoney;
	}

	public void setServiceMoney(float serviceMoney) {
		this.serviceMoney = serviceMoney;
	}

	@Column(name = "advanceMoney")
	public float getAdvanceMoney() {
		return advanceMoney;
	}

	public void setAdvanceMoney(float advanceMoney) {
		this.advanceMoney = advanceMoney;
	}

	@Column(name = "des")
	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}
 
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "srid", referencedColumnName = "srid")
	public ServiceReceiptPO getServiceReceipt() {
		return serviceReceipt;
	}

	public void setServiceReceipt(ServiceReceiptPO serviceReceipt) {
		this.serviceReceipt = serviceReceipt;
	}
}
