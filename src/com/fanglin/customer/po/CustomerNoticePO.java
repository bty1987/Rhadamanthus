package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.vo.CustomerNoticeVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "customernotice", catalog = "customer")
public class CustomerNoticePO implements Serializable {

	private static final long serialVersionUID = -7855468542006410866L;

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_SERVER_INT = 1;

	private long cnid;

	private long cid;

	private String orderId;

	private String title;

	private String content;

	private UserPO creater;

	private Timestamp createTime;

	private short type;

	private String path;

	@Id
	@GeneratedValue
	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "uid", referencedColumnName = "uid")
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public CustomerNoticePO init(String orderId, String title, String content, String path, UserPO creater) {

		setOrderId(orderId);

		setTitle(title);
		setContent(content);
		setPath(path);

		setCreater(creater);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		setType(path != null ? TYPE_SERVER_INT : TYPE_COMMON_INT);

		return this;
	}

	public CustomerNoticeVO ptv(CustomerNoticeVO customerNoticeVO) {

		BeanUtil.copyProperties(this, customerNoticeVO, Arrays.asList("creater"));

		if (customerNoticeVO.getCreater() != null && getCreater() != null) customerNoticeVO.getCreater().setBaseInfo(getCreater());

		return customerNoticeVO;
	}
}
