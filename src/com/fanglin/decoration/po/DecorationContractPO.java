/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fadada.bean.Contract;
import com.fanglin.communion.po.ContractPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationcontract", catalog = "decoration")
public class DecorationContractPO implements Serializable, Contract {

	private static final long serialVersionUID = -5971474052433501162L;

	public static final short STATUS_VALID_INT = 0;// 初始
	
	public static final short STATUS_STAY_SIGN_INT = 1;// 待签订
	
	public static final short STATUS_END_SIGN_INT = 2;// 已签订

	public static final short STATUS_NULL_INT = 3;// 无效

	public static final short STATUS_FILE_INT = 4;// 归档
	
	public static final short TYPE_SIGNET_INT = 1;// 签章

	public static final short TYPE_SIGN_INT = 2;// 签订

	public static final short TYPE_VIEW_INT = 3;// 查看
	
	public static final short TYPE_DOWNLOAD_INT = 4;// 下载

	private long dcid;

	private String orderId;

	private ContractPO contract;

	private String download;

	private String viewpdf;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	public DecorationContractPO() {
		super();
	}

	public DecorationContractPO(ContractPO contract, UserPO creater) {
		super();
		this.contract = contract;
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "dcid")
	public long getDcid() {
		return dcid;
	}

	public void setDcid(long dcid) {
		this.dcid = dcid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ContractPO getContract() {
		return contract;
	}

	public void setContract(ContractPO contract) {
		this.contract = contract;
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
		return contract.getNo();
	}

	@Override
	public String contentCode() {
		return String.format("%s%s", orderId, dcid);
	}

	@Override
	public String title() {
		return contract.getTitle();
	}

	@Override
	public void status(short status) {
		this.status = status;
	}

}
