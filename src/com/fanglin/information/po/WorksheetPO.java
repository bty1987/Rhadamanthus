package com.fanglin.information.po;

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
@Table(name = "worksheet", catalog = "information")
public class WorksheetPO implements java.io.Serializable {

	private static final long serialVersionUID = -649765382182810264L;

	public static final short STATUS_INIT_INT = 0; //初始
	
	public static final short STATUS_CANCEL_INT = 1; //取消
	
	public static final short STATUS_HANDL_INT = 2; //已处理
	
	private long wsid;
	
	private String code;
	
	private String module;
	
	private String content;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private short status;
	
	private UserPO handler;
	
	private Timestamp handTime;
	
	private String result;
	
	@Id
	@GeneratedValue
	@Column(name = "wsid")
	public long getWsid() {
		return wsid;
	}

	public void setWsid(long wsid) {
		this.wsid = wsid;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "module")
	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}
	
	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "huid", referencedColumnName = "uid")
	public UserPO getHandler() {
		return handler;
	}

	public void setHandler(UserPO handler) {
		this.handler = handler;
	}

	@Column(name = "handTime")
	public Timestamp getHandTime() {
		return handTime;
	}

	public void setHandTime(Timestamp handTime) {
		this.handTime = handTime;
	}

	@Column(name = "result")
	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
	
}
