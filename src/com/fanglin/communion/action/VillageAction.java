package com.fanglin.communion.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.communion.service.VillageService;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VillageAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;

	@Autowired
	private VillageService villageService;

	private VillageVO village;

	private List<VillageVO> villages;

	private List<String> autoFillList;

	private List<KeyValueVO> autoFillKeyValue;

	private String pinyinName;

	@Action(value = "pageVillage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVillage() throws FLException {

		villageService.pageVillage(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryVillageByVid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVillageByVid() throws FLException {

		village = villageService.queryVillageByVid(village);

		return SUCCESS;
	}

	@Action(value = "queryVillageForNameByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVillageForNameByPinyin() throws FLException {

		villages = villageService.queryVillageForNameByPinyin(pinyinName, village, queryCompany());

		for (VillageVO villageVO : villages) {
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(String.valueOf(villageVO.getNo()));
			keyValueVO.setValue(villageVO.getName() + "-" + villageVO.getCityProper().getName());
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(villageVO.getName());
		}

		return SUCCESS;
	}

	@Action(value = "addVillage", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVillage() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageService.addVillage(village, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateVillage", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVillage() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageService.updateVillage(village, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateVillageForStatus", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVillageForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageService.updateVillageForStatus(village);

		return SUCCESS;
	}

	@Action(value = "updateVillageForPosition", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVillageForPosition() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageService.updateVillageForPosition(village);

		return SUCCESS;
	}

	@Action(value = "updateVillageForUrl", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVillageForUrl() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		villageService.updateVillageForUrl(village);

		return SUCCESS;
	}

	@Action(value = "locateVillage", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String locateVillage() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		village = villageService.locateVillage(village);

		return SUCCESS;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public List<VillageVO> getVillages() {
		return villages;
	}

	public void setVillages(List<VillageVO> villages) {
		this.villages = villages;
	}

	public List<String> getAutoFillList() {
		if (autoFillList == null) {
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

}
