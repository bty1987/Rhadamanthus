package com.fanglin.quotation.po;

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

import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationPictureVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationpicture", catalog = "quotation")
public class QuotationPicturePO implements Serializable {

	private static final long serialVersionUID = 4636492933534286916L;

	public static final short STATUS_YES_SHORT = 0;

	public static final short STATUS_DEL_SHORT = 1;

	// type 媒体来源类型: 1=钉钉媒体图片(api.common.uploadImg上传)
	public static final short TYPE_DING_INT = 1;

	// atttype 业务归属类型: 0=默认(历史存量未分类) 1=选材(selectionItem) 3=附加项(normriceItem)
	public static final short ATTTYPE_INIT_INT = 0;

	public static final short ATTTYPE_SELECT_INT = 1;

	public static final short ATTTYPE_QUOTA_INT = 3;

	private long qpid;

	private String orderId;

	private long qid;

	private long areaId;

	private String areaName;

	private long bid;

	private long qiid;

	private String name;

	private String path;

	private int filesize;

	private short type;

	private short atttype;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	@Id
	@GeneratedValue
	@Column(name = "qpid")
	public long getQpid() {
		return qpid;
	}

	public void setQpid(long qpid) {
		this.qpid = qpid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "areaId")
	public long getAreaId() {
		return areaId;
	}

	public void setAreaId(long areaId) {
		this.areaId = areaId;
	}

	@Column(name = "areaName")
	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "filesize")
	public int getFilesize() {
		return filesize;
	}

	public void setFilesize(int filesize) {
		this.filesize = filesize;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
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

	public QuotationPictureVO ptv(QuotationPictureVO quotationPictureVO) {

		BeanUtil.copyProperties(this, quotationPictureVO, Arrays.asList("creater"));

		if (quotationPictureVO.getCreater() != null && getCreater() != null) BeanUtil.copyProperties(getCreater(), quotationPictureVO.getCreater(), Arrays.asList("duty", "dept", "role"));

		return quotationPictureVO;
	}

}
