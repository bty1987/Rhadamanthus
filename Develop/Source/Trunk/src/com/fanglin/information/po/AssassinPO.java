package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "assassin", catalog = "platform")
public class AssassinPO implements java.io.Serializable {

	private static final long serialVersionUID = 8696621508235364905L;
	
	private int asId;
	
	private String api;
	
	private String params;
	
	private String server;
	
	private int errorcode;
	
	private String errormes;

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
	public String getParams() {
		return params;
	}

	public void setParams(String params) {
		this.params = params;
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
}
