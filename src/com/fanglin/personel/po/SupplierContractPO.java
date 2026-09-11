package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

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
import com.fanglin.personel.vo.SupplierContractVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "suppliercontract", catalog = "communion")
public class SupplierContractPO implements Serializable, Contract {

	private static final long serialVersionUID = -7519420532093520141L;

	public static final short STATUS_VALID_INT = 0;// 初始

	public static final short STATUS_NULL_INT = 1;// 无效

	public static final short STATUS_SIGN_INT = 2;// 已签

	public static final short STATUS_FILE_INT = 3;// 归档

	public static final short TYPE_SIGNET_INT = 1;// 签章

	public static final short TYPE_SIGN_INT = 2;// 签订

	public static final short TYPE_VIEW_INT = 3;// 查看

	public static final short TYPE_DOWNLOAD_INT = 4;// 下载

	private long scid;

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

	// 电子签厂商：1=法大大 2=e签宝（见 com.fanglin.elecsign.enums.ElecsignProvider），存量默认1
	private Short provider;

	// 厂商流程号（e签宝专用：upload/generate 后存 fileId，签署建流后覆盖为 signFlowId；法大大不使用）
	private String flowId;

	private String viewpdf;

	private int filesize;

	private UserPO creater;

	private UserPO signner;

	private Timestamp comsignTime;

	private Timestamp cussignTime;

	private short status;

	private String comment;

	public SupplierContractPO() {
		super();
	}

	public SupplierContractPO(UserPO creater, UserPO signner) {

		super();

		this.creater = creater;
		this.creater = signner;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "scid")
	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
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
		return String.format("%s%s", no, scid);
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

	public SupplierContractVO ptv(SupplierContractVO supplierContractVO) {

		BeanUtil.copyProperties(this, supplierContractVO, Arrays.asList("creater","signner"));
		
		if (supplierContractVO.getCreater() != null && getCreater() != null) supplierContractVO.getCreater().setBaseInfo( getCreater());
		if (supplierContractVO.getSignner() != null && getSignner() != null) supplierContractVO.getSignner() .setBaseInfo(getSignner());

		return supplierContractVO;
	}
}
