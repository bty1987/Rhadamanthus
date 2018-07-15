package com.fanglin.decoration.po;

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
@Table(name = "decorationoperate", catalog = "decoration")
public class DecorationOperatePO implements java.io.Serializable {

	private static final long serialVersionUID = 5505808285022334255L;
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_DISABLED_INT = 1;	
	
	public static final short TYPE_CREATE_DECORATION_ORDER_INT = 1; 
	
	public static final short TYPE_WASTE_DECORATION_ORDER_INT = 2;	
	
	public static final short TYPE_TERMINATION_DECORATION_ORDER_INT = 3;	
	
	public static final short TYPE_SUB_DECORATION_QUOTATION_NUM_INT = 4;	
	
	public static final short TYPE_SIGN_DECORATION_ORDER_INT = 5;		
	
	public static final short TYPE_RESIGN_DECORATION_ORDER_INT = 6;		
	
	public static final short TYPE_SIGNED_DECORATION_ORDER_INT = 7;		
	
	public static final short TYPE_BELONG_DECORATION_ORDER_INT = 8;	
	
//	public static final short TYPE_SALESMAN_DECORATION_ORDER_INT = 9;	
	
	public static final short TYPE_CONTRACT_DECORATION_ORDER_INT = 10;	
	
	private long doid;
	
	private String orderId;
	
	private UserPO operater;
	
	private Timestamp operateTime;
	
	private float value;
	
	private short type;
	
	private short status;
	
	private String comment;

	private long dsuid;
	
	private long smuid;
	
	private long dsdid;
	
	private long dsrid;
	
	private long smdid;
	
	private long smrid;
	
	private float drate;
	
	private float srate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "doid")
	public long getDoid(){
		return this.doid;
	}

	public void setDoid(long doid){
		this.doid = doid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ouid", referencedColumnName="uId")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "value")
	public float getValue() {
		return value;
	}

	public void setValue(float value) {
		this.value = value;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "dsuid")
	public long getDsuid() {
		return dsuid;
	}

	public void setDsuid(long dsuid) {
		this.dsuid = dsuid;
	}

	@Column(name = "smuid")
	public long getSmuid() {
		return smuid;
	}

	public void setSmuid(long smuid) {
		this.smuid = smuid;
	}

	@Column(name = "dsdid")
	public long getDsdid() {
		return dsdid;
	}

	public void setDsdid(long dsdid) {
		this.dsdid = dsdid;
	}

	@Column(name = "dsrid")
	public long getDsrid() {
		return dsrid;
	}

	public void setDsrid(long dsrid) {
		this.dsrid = dsrid;
	}

	@Column(name = "smdid")
	public long getSmdid() {
		return smdid;
	}

	public void setSmdid(long smdid) {
		this.smdid = smdid;
	}

	@Column(name = "smrid")
	public long getSmrid() {
		return smrid;
	}

	public void setSmrid(long smrid) {
		this.smrid = smrid;
	}

	@Column(name = "drate")
	public float getDrate() {
		return drate;
	}

	public void setDrate(float drate) {
		this.drate = drate;
	}

	@Column(name = "srate")
	public float getSrate() {
		return srate;
	}

	public void setSrate(float srate) {
		this.srate = srate;
	}
	
}