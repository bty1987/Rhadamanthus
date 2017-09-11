package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "assassin", catalog = "information")
public class AssassinPO implements java.io.Serializable {

	private static final long serialVersionUID = 8696621508235364905L;
	
	private int asId;
	
	private String api;
	
	private String content;
	
	private String server;
	
	private int errorcode;
	
	private String errormes;
	
	private UserPO operater;
	
	private Timestamp operateTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asId")
	public int getAsId() {
		return asId;
	}

	public void setAsId(int asId) {
		this.asId = asId;
	}

	@Column(name = "api")
	public String getApi() {
		return api;
	}

	public void setApi(String api) {
		this.api = api;
	}

	@Column(name = "params")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "server")
	public String getServer() {
		return server;
	}

	public void setServer(String server) {
		this.server = server;
	}

	@Column(name = "errorcode")
	public int getErrorcode() {
		return errorcode;
	}

	public void setErrorcode(int errorcode) {
		this.errorcode = errorcode;
	}

	@Column(name = "errormes")
	public String getErrormes() {
		return errormes;
	}

	public void setErrormes(String errormes) {
		this.errormes = errormes;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ouid",referencedColumnName="uid")
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
	
}
