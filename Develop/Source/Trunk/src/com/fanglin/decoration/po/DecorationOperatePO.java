package com.fanglin.decoration.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationoperate", catalog = "platform")
public class DecorationOperatePO implements java.io.Serializable {

	private static final long serialVersionUID = 5505808285022334255L;
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short TYPE_CREATE_DECORATION_ORDER_INT = 1;
	
	public static final short TYPE_WASTE_DECORATION_ORDER_INT = 2;
	
	public static final short TYPE_TERMINATION_DECORATION_ORDER_INT = 3;
	
	public static final short TYPE_SUB_DECORATION_QUOTATION_NUM_INT = 4;
	
	public static final short TYPE_SIGN_DECORATION_ORDER_INT = 5;
	
	public static final short TYPE_RESIGN_DECORATION_ORDER_INT = 6;
	
	public static final short TYPE_SIGNED_DECORATION_ORDER_INT = 7;
	
	public static final short TYPE_DESIGN_DECORATION_ORDER_INT = 8;
	
	public static final short TYPE_SALESMAN_DECORATION_ORDER_INT = 9;
	
	private Long doId;
	
	private DecorationOrderPO decorationOrder;
	
	private UserPO targer;
	
	private UserPO operater;
	
	private Timestamp operateTime;
	
	private float value;
	
	private short type;
	
	private short status;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "doId")
	public Long getDoId(){
		return this.doId;
	}

	public void setDoId(Long doId){
		this.doId = doId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName="orderId")
	public DecorationOrderPO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "targerId", referencedColumnName="userId")
	public UserPO getTarger() {
		return targer;
	}

	public void setTarger(UserPO targer) {
		this.targer = targer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "operaterId", referencedColumnName="userId")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public float getValue() {
		return value;
	}

	public void setValue(float value) {
		this.value = value;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}