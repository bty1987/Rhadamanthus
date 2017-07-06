package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import javax.persistence.JoinColumn;

import javax.persistence.Table;

import com.fanglin.information.po.NoticePO;

@Entity
@Table(name = "noticesdepartment", catalog = "platform")
public class NoticeDepartmentPO implements Serializable{


	private static final long serialVersionUID = 1145569082063384689L;
	
	public  static final String NOTICE = "notice.noticeId";
	private Integer ndid;
	private NoticePO notice;
	private int did;
		
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ndid")
	public Integer getNdid() {
		return ndid;
	}
	
	public void setNdid(Integer ndid) {
		this.ndid = ndid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "nid", referencedColumnName="noticeId")
	public NoticePO getNotice() {
		return notice;
	}
	
	public void setNotice(NoticePO notice) {
		this.notice = notice;
	}

	@Column(name = "did")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}
	
	

	
}
