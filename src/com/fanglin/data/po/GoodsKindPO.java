package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "goodsKind", catalog = "data")
public class GoodsKindPO implements Serializable {

	private static final long serialVersionUID = 4993103329657750868L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_LEVEL_STR = "level";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long gkid;

	private String no;

	private String name;

	private short level;

	private short status;

	public GoodsKindPO() {
		super();
	}

	public GoodsKindPO(long gkid) {
		super();
		this.gkid = gkid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gkid")
	public long getGkid() {
		return gkid;
	}

	public void setGkid(long gkid) {
		this.gkid = gkid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
