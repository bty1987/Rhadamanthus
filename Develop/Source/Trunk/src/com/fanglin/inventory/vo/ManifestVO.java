package com.fanglin.inventory.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class ManifestVO implements java.io.Serializable {

	private static final long serialVersionUID = 1273017581681919428L;

	private Long mid;
	
	private String code;
	
	private Timestamp createTime;
	
	private Timestamp manifestTime;
	
	private UserVO createUser;
	
	private Float total;
	
	private Short type;
	
	private Short status;
	
	private String comment;
	
	private String attachment;
	
	private ManifestVO quoteManifest;
	
	public ManifestVO() {
		super();
	}

	public ManifestVO(UserVO createUser) {
		super();
		this.createUser = createUser;
	}

	public Long getMid() {
		return this.mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getManifestTime() {
		return this.manifestTime;
	}

	public void setManifestTime(Timestamp manifestTime) {
		this.manifestTime = manifestTime;
	}

	public UserVO getCreateUser() {
		return createUser;
	}

	public void setCreateUser(UserVO createUser) {
		this.createUser = createUser;
	}

	public Float getTotal() {
		return this.total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Short getType() {
		return this.type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAttachment() {
		return this.attachment;
	}

	public void setAttachment(String attachment) {
		this.attachment = attachment;
	}

	public ManifestVO getQuoteManifest() {
		return quoteManifest;
	}

	public void setQuoteManifest(ManifestVO quoteManifest) {
		this.quoteManifest = quoteManifest;
	}

}