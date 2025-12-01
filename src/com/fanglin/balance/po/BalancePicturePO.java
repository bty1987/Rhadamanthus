package com.fanglin.balance.po;

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

import com.fanglin.balance.vo.BalancePictureVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "balancePicture", catalog = "balance")
public class BalancePicturePO implements Serializable {

	private static final long serialVersionUID = -5096185617415787865L;

	public static final String COLUMN_BID_STR = "bid";

	public static final String COLUMN_PID_STR = "pid";

	public static final short STATUS_YES_SHORT = 0;

	public static final short STATUS_DEL_SHORT = 1;

	public static final short TYPE_CUTPAY_INT = 0;

	private long bpid;

	private long bid;

	private long pid;

	private String name;

	private String path;

	private int filesize;

	private short type;

	UserPO creater;

	private Timestamp createTime;

	private short status;

	public BalancePicturePO() {
		super();
	}

	public BalancePicturePO(long bpid, long bid, long pid, String name, String path, short type, UserPO creater, Timestamp createTime, short status) {
		super();
		this.bpid = bpid;
		this.bid = bid;
		this.pid = pid;
		this.name = name;
		this.path = path;
		this.type = type;
		this.creater = creater;
		this.createTime = createTime;
		this.status = status;
	}

	@Id
	@GeneratedValue
	@Column(name = "bpid")
	public long getBpid() {
		return bpid;
	}

	public void setBpid(long bpid) {
		this.bpid = bpid;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
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

	public BalancePictureVO ptv(BalancePictureVO balancePictureVO) {

		BeanUtil.copyProperties(this, balancePictureVO, Arrays.asList("creater"));

		if (balancePictureVO.getCreater() != null && getCreater() != null) balancePictureVO.getCreater().setBaseInfo(getCreater());

		return balancePictureVO;
	}

}
