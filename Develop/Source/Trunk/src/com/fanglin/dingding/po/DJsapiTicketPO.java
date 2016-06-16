package com.fanglin.dingding.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "djsapiticket", catalog = "hades")
public class DJsapiTicketPO implements java.io.Serializable {

	private static final long serialVersionUID = 4079720388361902032L;
	
	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	private long djtId;
	
	private String jsapi;
	
	private long operateTime;

	public DJsapiTicketPO() {
		super();
	}

	public DJsapiTicketPO(String jsapi, long operateTime) {
		super();
		this.jsapi = jsapi;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "djtId")
	public long getDjtId() {
		return this.djtId;
	}

	public void setDjtId(long djtId) {
		this.djtId = djtId;
	}

	@Column(name = "jsapi")
	public String getJsapi() {
		return this.jsapi;
	}

	public void setJsapi(String jsapi) {
		this.jsapi = jsapi;
	}

	@Column(name = "operateTime")
	public long getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(long operateTime) {
		this.operateTime = operateTime;
	}

}