/**
 * @File Name	: CleaningDrawingVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.po.UserPO;

public class ConstructionDrawingVO implements Serializable {

	private static final long serialVersionUID = 6352865797932189706L;

	private Integer cdId;

	private Long cid;

	private Long csid;

	private Long cnid;

	private String drawingName;

	private String drawingUrl;

	private String drawingAddUrl;

	private Integer filesize;

	private Short type;

	private UserPO creater;

	private Timestamp createTime;

	private Short schedule;

	public Integer getCdId() {
		return cdId;
	}

	public void setCdId(Integer cdId) {
		this.cdId = cdId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public String getDrawingName() {
		return drawingName;
	}

	public void setDrawingName(String drawingName) {
		this.drawingName = drawingName;
	}

	public String getDrawingUrl() {
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl) {
		this.drawingUrl = drawingUrl;
	}

	public String getDrawingAddUrl() {
		return drawingAddUrl;
	}

	public void setDrawingAddUrl(String drawingAddUrl) {
		this.drawingAddUrl = drawingAddUrl;
	}

	public Integer getFilesize() {
		return filesize;
	}

	public void setFilesize(Integer filesize) {
		this.filesize = filesize;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

}
