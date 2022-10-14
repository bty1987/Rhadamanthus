package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ConversationVO implements Serializable {

	private static final long serialVersionUID = -7626900088522132889L;

	private Long cid;

	private String orderId;

	private Short type;

	private Short atttype;

	private Short contype;

	private String content;

	private String path;

	private Integer filesize;

	private Integer width;

	private Integer height;

	private UserBaseVO focuser;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	public ConversationVO() {
		super();
	}

	public ConversationVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getContype() {
		return contype;
	}

	public void setContype(Short contype) {
		this.contype = contype;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Integer getFilesize() {
		return filesize;
	}

	public void setFilesize(Integer filesize) {
		this.filesize = filesize;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public UserBaseVO getFocuser() {
		return focuser;
	}

	public void setFocuser(UserBaseVO focuser) {
		this.focuser = focuser;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
