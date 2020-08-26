package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "usereducation", catalog = "communion")
public class UserEducationPO implements Serializable  {

	private static final long serialVersionUID = 9140155980491786752L;

	private long ueid;
	
	private long uid;
	
	private String organ;

	private String certificate;
	
	private String beginTime;
	
	private String endTime;
	
	private Timestamp createTime;
	
	private String content;
	
	private String specialty;

	public UserEducationPO() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ueid") 
	public long getUeid() {
		return ueid;
	}

	public void setUeid(long ueid) {
		this.ueid = ueid;
	}

	@Column(name = "uid") 
	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	@Column(name = "organ") 
	public String getOrgan() {
		return organ;
	}

	public void setOrgan(String organ) {
		this.organ = organ;
	}

	@Column(name = "certificate") 
	public String getCertificate() {
		return certificate;
	}

	public void setCertificate(String certificate) {
		this.certificate = certificate;
	}

	@Column(name = "endTime") 
	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
	@Column(name = "beginTime") 
	public String getBeginTime() {
		return beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	@Column(name = "createTime") 
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "content") 
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "specialty") 
	public String getSpecialty() {
		return specialty;
	}

	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}

}
