package com.fanglin.sales.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "salesactivityitem", catalog = "sales")
public class SalesActivityItemPO implements Serializable {

	private static final long serialVersionUID = 3148602067058233456L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final short STATUS_VALID_INT = 0;//初始

	public static final short STATUS_UNVALID_INT = 1;//失效

	public static final short STATUS_RECEIVE_INT = 2;//已领
	
	public static final short STATUS_REFUND_INT = 3;//退货
	
	public static final short STATUS_DELIVERY_INT = 4;//配送
	
	public static final short STATUS_UNRETURNED_INT = 5;//未退
	
	public static final short STATUS_UPGRADE_INT = 6;//升级
	
	public static final short STATUS_CONSUME_INT = 7;//消耗
	
	public static final short ISSTOCK_COUNTIN_INT = 0;//计入库存

	private long saiid;

	private long aid;

	private long asid;

	private String orderId;

	private String activity;

	private String name;

	private int num;

	private int money;

	private short state;

	private short isStock;

	private short type;

	private String content;

	private UserPO receiveUserId;

	private String receiveUserName;

	private Timestamp receiveTime;
	
	public SalesActivityItemPO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "saiid")
	public long getSaiid() {
		return saiid;
	}

	public void setSaiid(long saiid) {
		this.saiid = saiid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "asid")
	public long getAsid() {
		return asid;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "activity")
	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "money")
	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "state")
	public short getState() {
		return state;
	}

	public void setState(short state) {
		this.state = state;
	}

	@Column(name = "isStock")
	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiveUserId",referencedColumnName="uId")
	public UserPO getReceiveUserId() {
		return receiveUserId;
	}

	public void setReceiveUserId(UserPO receiveUserId) {
		this.receiveUserId = receiveUserId;
	}

	@Column(name = "receiveUserName")
	public String getReceiveUserName() {
		return receiveUserName;
	}

	public void setReceiveUserName(String receiveUserName) {
		this.receiveUserName = receiveUserName;
	}

	@Column(name = "receiveTime")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}
	
}
