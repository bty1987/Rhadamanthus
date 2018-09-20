package com.fanglin.customer.po;

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
@Table(name = "vscorerecord", catalog = "customer")
public class VscoreRecordPO implements Serializable {
	
	private static final long serialVersionUID = 7956451372939800206L;
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	public static final short TYPE_ADDED_INT = 0;
			
	public static final short TYPE_EXTRACT_INT = 1;
	
	public static final short STATUS_INITIAL_INT = 0;
	
	public static final short STATUS_PASS_INT = 1;
	
	public static final short STATUS_DOWN_INT = 2;
	
	private long vsrid;
	
	private String unionId;
	
	private String orderId;
	
	private float score;
	
	private UserPO operater; 
	
	private Timestamp operateTime;
	
	private short type;
	
	private short status;
	
	private String comment;
	
	public VscoreRecordPO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vsrid")
	public long getVsrid() {
		return vsrid;
	}

	public void setVsrid(long vsrid) {
		this.vsrid = vsrid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "score")
	public float getScore() {
		return score;
	}

	public void setScore(float score) {
		this.score = score;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
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
	
}
