package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.HouseLayoutService;
import com.fanglin.communion.vo.HouseLayoutVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class HouseLayoutAction extends BaseListAction {

	private static final long serialVersionUID = 4614092194550302941L;

	@Autowired
	private HouseLayoutService houseLayoutService;

	private HouseLayoutVO houseLayout;

	private List<HouseLayoutVO> houseLayouts;

	@Action(value = "pageHouseLayout", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHouseLayout() throws FLException {

		houseLayoutService.pageHouseLayout(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryHouseLayout", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseLayout() throws FLException {

		houseLayouts = houseLayoutService.queryHouseLayout(houseLayout);

		return SUCCESS;
	}

	@Action(value = "addHouseLayout", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHouseLayout() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		houseLayoutService.addHouseLayout(houseLayout);

		return SUCCESS;
	}

	@Action(value = "deleteHouseLayout", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteHouseLayout() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		houseLayoutService.deleteHouseLayout(houseLayout);

		return SUCCESS;
	}

	public HouseLayoutVO getHouseLayout() {
		return houseLayout;
	}

	public void setHouseLayout(HouseLayoutVO houseLayout) {
		this.houseLayout = houseLayout;
	}

	public List<HouseLayoutVO> getHouseLayouts() {
		return houseLayouts;
	}

	public void setHouseLayouts(List<HouseLayoutVO> houseLayouts) {
		this.houseLayouts = houseLayouts;
	}

}
