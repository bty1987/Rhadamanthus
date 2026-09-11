package com.fanglin.payment.po;

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

import com.fanglin.fadada.bean.Contract;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "paymentcontract", catalog = "payment")
public class PaymentContractPO implements Serializable, Contract {

	private static final long serialVersionUID = 9046910727127601985L;
	
	public static final short STATUS_VALID_INT = 0;// 初始

	public static final short STATUS_SIGN_INT = 1;// 已签

	public static final short STATUS_NULL_INT = 2;// 无效

	public static final short STATUS_FILE_INT = 3;// 归档

	public static final short TYPE_SIGNET_INT = 1;// 签章

	public static final short TYPE_SIGN_INT = 2;// 签订

	public static final short TYPE_VIEW_INT = 3;// 查看

	public static final short TYPE_DOWNLOAD_INT = 4;// 下载

	private long pcid;

	private long rtid;

	private String orderId;

	private short paymentType;

	private String download;

	// 电子签厂商：1=法大大 2=e签宝（见 com.fanglin.elecsign.enums.ElecsignProvider），存量默认1
	private Short provider;

	// 厂商流程号（e签宝专用：upload/generate 后存 fileId，签署建流后覆盖为 signFlowId；法大大不使用）
	private String flowId;

	private String viewpdf;

	private UserPO creater;

	private UserPO signner;

	private UserPO filinner;

	private Timestamp createTime;

	private Timestamp comsignTime;

	private Timestamp cussignTime;

	private Timestamp filingTime;

	private short status;

	public PaymentContractPO() {
		super();
	}
	
	public PaymentContractPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "pcid")
	public long getPcid() {
		return pcid;
	}

	public void setPcid(long pcid) {
		this.pcid = pcid;
	}

	@Column(name = "rtid")
	public long getRtid() {
		return rtid;
	}

	public void setRtid(long rtid) {
		this.rtid = rtid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "paymenttype")
	public short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(short paymentType) {
		this.paymentType = paymentType;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSignner() {
		return signner;
	}

	public void setSignner(UserPO signner) {
		this.signner = signner;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fuid", referencedColumnName = "uid")
	public UserPO getFilinner() {
		return filinner;
	}

	public void setFilinner(UserPO filinner) {
		this.filinner = filinner;
	}

	@Column(name = "filingTime")
	public Timestamp getFilingTime() {
		return filingTime;
	}

	public void setFilingTime(Timestamp filingTime) {
		this.filingTime = filingTime;
	}

	@Override
	public String download() {
		return this.download;
	}

	@Override
	public void download(String download) {
		this.download = download;
	}

	@Override
	public String viewpdf() {
		return this.viewpdf;
	}

	@Override
	public void viewpdf(String viewpdf) {
		this.viewpdf = viewpdf;
	}

	@Override
	public String templateCode() {
		return null;
	}

	@Override
	public String contentCode() {
		return String.format("%s%s", orderId, pcid);
	}

	@Override
	public String title() {
		return this.orderId;
	}

	@Override
	public void status(short status) {
		this.status = status;
	}

	@Override
	public String flowId() {
		return flowId;
	}

	@Override
	public void flowId(String flowId) {
		this.flowId = flowId;
	}

	@Column(name = "provider")
	public Short getProvider() {
		return provider;
	}

	public void setProvider(Short provider) {
		this.provider = provider;
	}

	@Column(name = "flowid")
	public String getFlowId() {
		return flowId;
	}

	public void setFlowId(String flowId) {
		this.flowId = flowId;
	}

}
