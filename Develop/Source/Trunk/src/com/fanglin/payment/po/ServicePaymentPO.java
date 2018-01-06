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

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "servicepayment", catalog = "payment")
public class ServicePaymentPO  implements java.io.Serializable {

	private static final long serialVersionUID = 5195595430982438028L;
	
	public static final String COLUMN_ORDERID_STR = "decoration.orderId";
	
	public static final String COLUMN_DESIGNER_STR = "designer.userName";
	
	public static final String COLUMN_VILLAGE_VILLAGENAME_STR = "village.name";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short COLUMN_INITIALSTATUS_INT = 0;
	
	public static final short COLUMN_STYPE_INT = 0;
	
	public static final short COLUMN_TTYPE_INT = 1;
	
	public static final short COLUMN_PAIDFORSTATUS_INT = 1; 
	
	public static final short COLUMN_CONFIRMEDSTATUS_INT = 2; 
	
	public static final float COLUMN_RATIO_INT = 1.1f; 
	
	public static final float COLUMN_MONEY_INT = 0f; 
	
	private long spid;
	
	private ServiceReceiptPO serviceReceipt;
	
	private DecorationPO decoration;
	
	private int pid;
	
	private short type;
	
	private short status;
	
	private UserPO creater;
	
	private UserPO collecter;
	
	private UserPO confirmer;
	
	private String createrName;
	
	private String collecterName;
	
	private String confirmerName;
	
	private Timestamp createTime;
	
	private Timestamp collcetTime;
	
	private Timestamp confirmTime;
	
	private float serviceMoney;
	
	private float advanceMoney;
	
	private String comment;
	
	public ServicePaymentPO() {
		super();
	}
	
	public ServicePaymentPO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}
	
	public ServicePaymentPO(UserPO creater,DecorationPO decoration) {
		super();
		this.creater = creater;
		this.decoration = decoration;
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
	@JoinColumn(name = "srid", referencedColumnName = "srid")
	public ServiceReceiptPO getServiceReceipt() {
		return serviceReceipt;
	}

	public void setServiceReceipt(ServiceReceiptPO serviceReceipt) {
		this.serviceReceipt = serviceReceipt;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
