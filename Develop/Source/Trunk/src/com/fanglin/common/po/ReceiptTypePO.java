package com.fanglin.common.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.finance.po.SubjectPO;

@Entity
@Table(name = "receipttype", catalog = "platform")
public class ReceiptTypePO implements java.io.Serializable {

	private static final long serialVersionUID = 6777289778875951609L;
	
	public static final String COLUMN_KEY_STR = "key";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short TYPE_CASH_INT = 1;
	
	public static final short TYPE_BANK_INT = 2;
	
	public static final short TYPE_CHECK_INT = 3;
	
	public static final short TYPE_ACCOUNT_INT = 4;
	
	public static final short TYPE_COUPON_INT = 5;
	
	private int rtId;
	
	private String name;
	
	private String key;
	
	private String subjectName;
	
	private String oneCode;
	
	private String twoCode;
	
	private String thrCode;
	
	private short direction;
	
	private short type;
	
	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rtId")
	public int getRtId() {
		return this.rtId;
	}

	public void setRtId(int rtId) {
		this.rtId = rtId;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "key")
	public String getKey() {
		return this.key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "subjectName")
	public String getSubjectName() {
		return this.subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	@Column(name = "oneCode")
	public String getOneCode() {
		return this.oneCode;
	}

	public void setOneCode(String oneCode) {
		this.oneCode = oneCode;
	}

	@Column(name = "twoCode")
	public String getTwoCode() {
		return this.twoCode;
	}

	public void setTwoCode(String twoCode) {
		this.twoCode = twoCode;
	}

	@Column(name = "thrCode")
	public String getThrCode() {
		return this.thrCode;
	}

	public void setThrCode(String thrCode) {
		this.thrCode = thrCode;
	}

	@Column(name = "direction")
	public short getDirection() {
		return this.direction;
	}

	public void setDirection(short direction) {
		this.direction = direction;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	public SubjectPO toSubjectPO(){
		return new SubjectPO(this.oneCode, this.twoCode, this.thrCode, this.subjectName, this.direction);
	}

}