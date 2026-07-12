/**
 * Title: UserContractPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.fadada.bean.Contract;

@Entity
@Table(name = "userContract", catalog = "communion")
public class UserContractPO implements Serializable, Contract {

	private static final long serialVersionUID = 8111974803190366547L;

	public static final short STATUS_VALID_INT = 0;// 初始

	public static final short STATUS_NULL_INT = 1;// 无效

	public static final short STATUS_SIGN_INT = 2;// 已签

	public static final short STATUS_FILE_INT = 3;// 归档

	public static final short TYPE_SIGNET_INT = 1;// 签章

	public static final short TYPE_SIGN_INT = 2;// 签订

	public static final short TYPE_VIEW_INT = 3;// 查看

	public static final short TYPE_DOWNLOAD_INT = 4;// 下载

	private long ucid;

	private int uid;

	private long cid;

	private String no;

	private String name;

	private String title;

	private String signTime;

	private String startTime;

	private String endTime;

	private Timestamp createTime;

	private String download;

	private String viewpdf;

	private int filesize;

	private UserPO creater;

	private UserPO signner;

	private Timestamp comsignTime;

	private Timestamp cussignTime;

	private short status;

	private String comment;

	public UserContractPO() {
		super();
	}

	public UserContractPO(UserPO creater, UserPO signner) {

		super();

		this.creater = creater;
		this.creater = signner;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ucid")
	public long getUcid() {
		return ucid;
	}

	public void setUcid(long ucid) {
		this.ucid = ucid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
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

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "signTime")
	public String getSignTime() {
		return signTime;
	}

	public void setSignTime(String signTime) {
		this.signTime = signTime;
	}

	@Column(name = "startTime")
	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "download")
	public String getDownload() {
		return download;
	}

	public void setDownload(String download) {
		this.download = download;
	}

	@Column(name = "viewpdf")
	public String getViewpdf() {
		return viewpdf;
	}

	public void setViewpdf(String viewpdf) {
		this.viewpdf = viewpdf;
	}

	@Column(name = "filesize")
	public int getFilesize() {
		return filesize;
	}

	public void setFilesize(int filesize) {
		this.filesize = filesize;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSignner() {
		return signner;
	}

	public void setSignner(UserPO signner) {
		this.signner = signner;
	}

	@Column(name = "comsignTime")
	public Timestamp getComsignTime() {
		return comsignTime;
	}

	public void setComsignTime(Timestamp comsignTime) {
		this.comsignTime = comsignTime;
	}

	@Column(name = "cussignTime")
	public Timestamp getCussignTime() {
		return cussignTime;
	}

	public void setCussignTime(Timestamp cussignTime) {
		this.cussignTime = cussignTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Override
	public String download() {
		return download;
	}

	@Override
	public void download(String download) {
		this.download = download;
	}

	@Override
	public String viewpdf() {
		return viewpdf;
	}

	@Override
	public void viewpdf(String viewpdf) {
		this.viewpdf = viewpdf;
	}

	@Override
	public String templateCode() {
		return getNo();
	}

	@Override
	public String contentCode() {
		return String.format("%s%s", no, ucid);
	}

	@Override
	public String title() {
		return getTitle();
	}

	@Override
	public void status(short status) {
		this.status = status;
	}

}
