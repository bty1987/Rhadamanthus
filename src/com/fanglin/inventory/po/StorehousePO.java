package com.fanglin.inventory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "storehouse", catalog = "inventory")
public class StorehousePO implements java.io.Serializable {

	private static final long serialVersionUID = -3272688015913745880L;
	
	public static final String COLUMN_CODE_STR = "code";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;

	private long shId;
	
	private String code;
	
	private String name;
	
	private short status;

	public StorehousePO() {
		super();
	}

	public StorehousePO(long shId) {
		super();
		this.shId = shId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "shId")
	public long getShId() {
		return this.shId;
	}

	public void setShId(long shId) {
		this.shId = shId;
	}

	@Column(name = "code")
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
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

}