package com.fanglin.finance.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
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
	
	public static final String COLUMN_DIRECTION_STR = "direction";

	private long sid;
	
	private short level;
	
	private String oneCode;
	
	private String twoCode;
	
	private String thrCode;
	
	private String name;
	
	private short direction;
	
	private short status;
	
	public SubjectPO() {
		super();
	}

	public SubjectPO(String oneCode, String twoCode, String thrCode, String name, short direction) {
		super();
		this.oneCode = oneCode;
		this.twoCode = twoCode;
		this.thrCode = thrCode;
		this.name = name;
		this.direction = direction;
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

	public short getDirection() {
		return direction;
	}

	public void setDirection(short direction) {
		this.direction = direction;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}