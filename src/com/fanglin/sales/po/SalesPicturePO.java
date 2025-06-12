package com.fanglin.sales.po;

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
import com.fanglin.sales.vo.SalesPictureVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesPicture", catalog = "sales")
public class SalesPicturePO implements Serializable {

	private static final long serialVersionUID = -5096185617415787865L;

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_SIID_STR = "siid";

	public static final short STATUS_YES_SHORT = 0;

	public static final short STATUS_DEL_SHORT = 1;

	private long spid;

	private long sid;

	private long siid;

	private String name;

	private String path;

	private int filesize;

	private short type;

	UserPO creater;

	private Timestamp createTime;

	private short status;

	public SalesPicturePO() {
		super();
	}

	public SalesPicturePO(long spid, long sid, long siid, String name, String path, short type, UserPO creater, Timestamp createTime, short status) {
		super();
		this.spid = spid;
		this.sid = sid;
		this.siid = siid;
		this.name = name;
		this.path = path;
		this.type = type;
		this.creater = creater;
		this.createTime = createTime;
		this.status = status;
	}

	@Id
	@GeneratedValue
	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
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

	public SalesPictureVO ptv(SalesPictureVO salesPictureVO) {

		BeanUtil.copyProperties(this, salesPictureVO, Arrays.asList("creater"));

		if (salesPictureVO.getCreater() != null && getCreater() != null) salesPictureVO.getCreater().setBaseInfo(getCreater());

		return salesPictureVO;
	}

}
