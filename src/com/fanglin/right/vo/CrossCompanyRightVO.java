package com.fanglin.right.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.system.vo.CompanyVO;

public class CrossCompanyRightVO implements Serializable {

	private static final long serialVersionUID = 5418035291480765412L;

	private int ucrid;

	private int uid;

	private String module;

	private List<String> cids;

	private List<CompanyVO> companys;

	private Timestamp createTime;

	public CrossCompanyRightVO() {
		super();
	}

	public int getUcrid() {
		return ucrid;
	}

	public void setUcrid(int ucrid) {
		this.ucrid = ucrid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public List<String> getCids() {
		return cids;
	}

	public void setCids(List<String> cids) {
		this.cids = cids;
	}

	public List<CompanyVO> getCompanys() {
		return companys;
	}

	public void setCompanys(List<CompanyVO> companys) {
		this.companys = companys;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
