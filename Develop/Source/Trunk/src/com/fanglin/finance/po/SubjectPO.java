package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "subject", catalog = "finance")
public class SubjectPO implements java.io.Serializable {

	private static final long serialVersionUID = 4194029261037679840L;
	
	public static final String COLUMN_SID_STR = "sid";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_ONECODE_STR = "oneCode";
	
	public static final String COLUMN_TWOCODE_STR = "twoCode";
	
	public static final String COLUMN_THRCODE_STR = "thrCode";
	
	public static final String COLUMN_CODE_STR = "code";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_LIMITS_STR = "limits";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	public static final short LIMITS_ENABLE_INT = 1;
	
	public static final short LIMITS_DISABLED_INT = 0;
	
	public static final short CODE_LENGTH_LEVEL_ONE_INT = 4;
	
	public static final short CODE_LENGTH_LEVEL_TWO_INT = 3;
	
	public static final short CODE_LENGTH_LEVEL_THR_INT = 3;
	
	public static final short CODE_LENGTH_INT = 10;

	private long sid;
	
	private short level;
	
	private String oneCode;
	
	private String twoCode;
	
	private String thrCode;
	
	private String name;
	
	private short status;
	
	private short limits;
	
	private String code;
	
	private short direction;
	
	private String assistant;

	public SubjectPO() {
		super();
	}

	public SubjectPO(long sid) {
		super();
		this.sid = sid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sId")
	public long getSid() {
		return this.sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "level")
	public short getLevel() {
		return this.level;
	}

	public void setLevel(short level) {
		this.level = level;
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

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "limits")
	public short getLimits() {
		return limits;
	}

	public void setLimits(short limits) {
		this.limits = limits;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "direction")
	public short getDirection() {
		return direction;
	}

	public void setDirection(short direction) {
		this.direction = direction;
	}

	@Column(name = "assistant")
	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

}