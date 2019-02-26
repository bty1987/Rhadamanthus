package com.fanglin.information.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "awardrecord", catalog = "information")
public class AwardRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = -2957865449207198464L;
	
	public static final String COLUMN_ASID_STR = "awardStock.asId";
	
	public static final short TYPE_CG_INT = 0; // 入库
	
	public static final short TYPE_XG_INT = 1; // 出库
	
	public static final short TYPE_SURPLUS_INT = 2; // 盘盈
	
	public static final short TYPE_LOSSES_INT = 3; // 盘亏
	
	private int arid;
	
	private String orderId;

	private AwardStockPO awardStock;

	private short type;

	private float num;

	private float totalPrice;

	private float unitPrice;

	private UserPO creater;

	private Timestamp operateTime;

	private String content;

	public AwardRecordPO(AwardStockPO awardStock, UserPO creater) {
		super();
		this.awardStock = awardStock;
		this.creater = creater;
	}

	public AwardRecordPO() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "arid")
	public int getArid() {
		return arid;
	}
	
	public void setArid(int arid) {
		this.arid = arid;
	}
	
	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "asid", referencedColumnName = "asid")
	public AwardStockPO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockPO awardStock) {
		this.awardStock = awardStock;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}
	
	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}
	
	@Column(name = "totalPrice")
	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}
	
	@Column(name = "unitPrice")
	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ouid", referencedColumnName ="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	
	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}
	
	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}