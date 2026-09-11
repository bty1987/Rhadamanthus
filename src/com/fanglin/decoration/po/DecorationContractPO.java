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
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.fadada.bean.Contract;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decorationcontract", catalog = "decoration")
public class DecorationContractPO implements Serializable, Contract {

	private static final long serialVersionUID = -5971474052433501162L;

	public static final short STATUS_VALID_INT = 0;// 初始

	public static final short STATUS_SIGN_INT = 1;// 已签

	public static final short STATUS_NULL_INT = 2;// 无效

	public static final short STATUS_FILE_INT = 3;// 归档

	public static final short STATUS_UNMAKE_INT = 5;

	public static final short TYPE_SIGNET_INT = 1;// 签章

	public static final short TYPE_SIGN_INT = 2;// 签订

	public static final short TYPE_VIEW_INT = 3;// 查看

	public static final short TYPE_DOWNLOAD_INT = 4;// 下载

	public static final short NOTICE_STATUS_CONFIRMED_INT = 0;// 已确认

	public static final short NOTICE_STATUS_UNCONFIRMED_INT = 1;// 未确认

	private long dcid;

	private String orderId;

	private long cid;// 合同ID

	private String no;// 合同编号

	private String name;// 名称

	private String title;// 标题

	private String download;

	// 电子签厂商：1=法大大 2=e签宝（见 com.fanglin.elecsign.enums.ElecsignProvider），存量默认1
	private Short provider;

	// 厂商流程号（e签宝专用：upload/generate 后存 fileId，签署建流后覆盖为 signFlowId；法大大不使用）
	private String flowId;

	private String viewpdf;

	private String path;

	private UserPO creater;

	private UserPO signner;

	private UserPO filinner;

	private Timestamp createTime;

	private Timestamp comsignTime;

	private Timestamp cussignTime;

	private Timestamp filingTime;

	private short status;

	private short ishow;

	private int filesize;

	private short noticeStatus;// 客户需求确认状态

	public DecorationContractPO() {
		super();
	}

	public DecorationContractPO(UserPO creater) {
		super();
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

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
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

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fuid", referencedColumnName = "uid")
	public UserPO getFilinner() {
		return filinner;
	}

	public void setFilinner(UserPO filinner) {
		this.filinner = filinner;
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

	@Column(name = "filingTime")
	public Timestamp getFilingTime() {
		return filingTime;
	}

	public void setFilingTime(Timestamp filingTime) {
		this.filingTime = filingTime;
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
		return getNo();
	}

	@Override
	public String contentCode() {
		return String.format("%s%s", orderId, dcid);
	}

	@Override
	public String title() {
		return getTitle();
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

	public short getIshow() {
		return ishow;
	}

	public void setIshow(short ishow) {
		this.ishow = ishow;
	}

	@Column(name = "filesize")
	public int getFilesize() {
		return filesize;
	}

	public void setFilesize(int filesize) {
		this.filesize = filesize;
	}

	@Column(name = "noticeStatus")
	public short getNoticeStatus() {
		return noticeStatus;
	}

	public void setNoticeStatus(short noticeStatus) {
		this.noticeStatus = noticeStatus;
	}

	public DecorationContractVO ptv(DecorationContractVO decorationContractVO) {

		BeanUtil.copyProperties(this, decorationContractVO, Arrays.asList("contract", "creater", "signner", "filinner"));

		if (decorationContractVO.getCreater() != null && getCreater() != null) decorationContractVO.getCreater().setBaseInfo(getCreater());
		if (decorationContractVO.getSignner() != null && getSignner() != null) decorationContractVO.getSignner().setBaseInfo(getSignner());
		if (decorationContractVO.getFilinner() != null && getFilinner() != null) decorationContractVO.getFilinner().setBaseInfo(getFilinner());

		return decorationContractVO;
	}

}
