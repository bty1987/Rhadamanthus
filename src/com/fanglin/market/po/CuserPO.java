package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cuser", catalog = "market")
public class CuserPO implements Serializable{
	
	private static final long serialVersionUID = 6548571142984638581L;
	
	public static final String COLUMN_CUID_INT = "cuid";
	
	public static final String COLUMN_UNIONID_STR = "unionId";

	private long cuid;
	
	private String unionId;

	public CuserPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="cuid")
	public long getCuid() {
		return cuid;
	}

	public void setCuid(long cuid) {
		this.cuid = cuid;
	}

	@Column(name="unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}
	
}
