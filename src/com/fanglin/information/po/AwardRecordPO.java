package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "awardrecord", catalog = "information")
public class AwardRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = -2957865449207198464L;

	public static final String COLUMN_ASID_STR = "awardStock.asId";

	public static final short TYPE_CG_INT = 0; // 入库

	public static final short TYPE_XG_INT = 1; // 出库

	public static final short TYPE_SURPLUS_INT = 2; // 盘盈

	public static final short TYPE_LOSSES_INT = 3; // 盘亏

	public static final short ONETYPE_NOT_INT = 0;// 无

	public static final short ONETYPE_DECORATION_INT = 1;// 装修

	public static final short ONETYPE_MATERIAL_INT = 2;// 主材

	public static final short ONETYPE_SALES_INT = 3;// 销售

	public static final short SUBTYPE_INWARE_INT = 0; // 入库

	public static final short SUBTYPE_RECEIVE_INT = 5;// 领取

	public static final short SUBTYPE_REFUND_INT = 6;// 退货

	public static final short SUBTYPE_DELIVERY_INT = 7;// 配送

	private long arid;

	private String orderId;

	private AwardStockPO awardStock;

	private short type;

	private short subtype;

	private short onetype;

	private short isStock;

	private int num;

	private int unitPrice;

	private long totalPrice;

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
	public long getArid() {
		return arid;
	}

	public void setArid(long arid) {
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

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	@Column(name = "onetype")
	public short getOnetype() {
		return onetype;
	}

	public void setOnetype(short onetype) {
		this.onetype = onetype;
	}

	@Column(name = "isStock")
	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "unitPrice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ouid", referencedColumnName = "uid")
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

	public AwardRecordPO init(AwardStockPO awardStock, UserPO creater, String orderId, short type, short subtype, short onetype, short isStock, Integer unitPrice, Integer num, String content) {

		unitPrice = unitPrice == null ? 0 : unitPrice;

		setAwardStock(awardStock);
		setCreater(creater);

		setOrderId(orderId);
		setType(type);
		setSubtype(subtype);
		setOnetype(onetype);
		setIsStock(isStock);

		setUnitPrice(unitPrice);
		setNum(num);
		setTotalPrice(Arith.mul(unitPrice, num));

		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setContent(content);

		return this;
	}

}