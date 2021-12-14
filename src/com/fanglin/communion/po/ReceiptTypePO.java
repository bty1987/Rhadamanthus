package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "receipttype", catalog = "communion")
public class ReceiptTypePO implements java.io.Serializable {

	private static final long serialVersionUID = 6777289778875951609L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_GRADE_STR = "grade";

	public static final short TYPE_CASH_INT = 1;

	public static final short TYPE_BANK_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short TYPE_ACCOUNT_INT = 4;

	public static final short TYPE_COUPON_INT = 5;

	public static final short STATUS_DISABLE_INT = 0;

	public static final short STATUS_ENABLE_INT = 1;

	public static final short COLUMN_DIRECTION_INT = 1;

	private int rtId;

	private String name;

	private String no;

	private String subjectName;

	private String oneCode;

	private String twoCode;

	private String thrCode;

	private short direction;

	private short type;
	
	private short fund;

	private short status;

	private int company;

	private String grade;

	private String kino;

	private String kiname;
	
	private String kibalance;
	
	private String bankno;

	private String assistant;
	
	private String value;

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

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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

	@Column(name = "fund")
	public short getFund() {
		return fund;
	}

	public void setFund(short fund) {
		this.fund = fund;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	@Column(name = "kibalance")
	public String getKibalance() {
		return kibalance;
	}

	public void setKibalance(String kibalance) {
		this.kibalance = kibalance;
	}

	@Column(name = "bankno")
	public String getBankno() {
		return bankno;
	}

	public void setBankno(String bankno) {
		this.bankno = bankno;
	}

	@Column(name = "assistant")
	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

	@Column(name = "value")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}