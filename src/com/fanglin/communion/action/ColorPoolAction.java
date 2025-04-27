package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.ColorPoolService;
import com.fanglin.communion.vo.ColorPoolVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ColorPoolAction extends BaseListAction {

	private static final long serialVersionUID = 8693338493574739752L;

	@Autowired
	private ColorPoolService colorPoolService;

	private List<ColorPoolVO> colorPools;

	private ColorPoolVO colorPool;

	@Action(value = "pageColorPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageColorPool() throws FLException {

		colorPoolService.pageColorPool(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryColorPoolByGpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryColorPoolByGpid() {

		colorPools = colorPoolService.queryColorPoolByGpid(colorPool);

		return SUCCESS;
	}

	@Action(value = "queryColorPoolForEnableByGpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryColorPoolForEnableByGpid() {

		colorPools = colorPoolService.queryColorPoolForEnableByGpid(colorPool);

		return SUCCESS;
	}

	@Action(value = "addColorPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addColorPool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		colorPoolService.addColorPool(colorPool);

		return SUCCESS;
	}

	@Action(value = "updateColorPoolForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateColorPoolForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		colorPoolService.updataColorPoolForStatus(colorPool);

		return SUCCESS;
	}

	public List<ColorPoolVO> getColorPools() {
		return colorPools;
	}

	public void setColorPools(List<ColorPoolVO> colorPools) {
		this.colorPools = colorPools;
	}

	public ColorPoolVO getColorPool() {
		return colorPool;
	}

	public void setColorPool(ColorPoolVO colorPool) {
		this.colorPool = colorPool;
	}
}
