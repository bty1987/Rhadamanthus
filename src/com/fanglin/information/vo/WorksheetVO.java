package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class WorksheetVO implements Serializable {

	private static final long serialVersionUID = -8833128747186236841L;

	private Long wsid;

	private String code;

	private String module;

	private String content;

	private String path;

	private UserVO creater;

	private Timestamp createTime;

	private Short status;

	private UserVO handler;

	private Timestamp handTime;

	private String result;

	public WorksheetVO() {
		super();
	}

	public WorksheetVO(UserVO creater, UserVO handler) {
		super();
		this.creater = creater;
		this.handler = handler;
	}

	public Long getWsid() {
		return wsid;
	}

	public void setWsid(Long wsid) {
		this.wsid = wsid;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
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

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserVO getHandler() {
		return handler;
	}

	public void setHandler(UserVO handler) {
		this.handler = handler;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getHandTime() {
		return handTime;
	}

	public void setHandTime(Timestamp handTime) {
		this.handTime = handTime;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

}
