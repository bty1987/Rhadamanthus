package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.FormatPoolService;
import com.fanglin.communion.vo.FormatPoolVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FormatPoolAction extends BaseListAction {

	private static final long serialVersionUID = -5865392600602464763L;

	@Autowired
	private FormatPoolService formatPoolService;

	private List<FormatPoolVO> formatPools;

	private FormatPoolVO formatPool;

	@Action(value = "pageFormatPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageFormatPool() throws FLException {

		formatPoolService.pageFormatPool(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryFormatPoolByGpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFormatPoolByGpid() {

		formatPools = formatPoolService.queryFormatPoolByGpid(formatPool);

		return SUCCESS;
	}

	@Action(value = "queryFormatPoolForEnableByGpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFormatPoolForEnableByGpid() {

		formatPools = formatPoolService.queryFormatPoolForEnableByGpid(formatPool);

		return SUCCESS;
	}

	@Action(value = "addFormatPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFormatPool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		formatPoolService.addFormatPool(formatPool);

		return SUCCESS;
	}

	@Action(value = "updateFormatPoolForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFormatPoolForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		formatPoolService.updateFormatPoolForStatus(formatPool);

		return SUCCESS;
	}

	public List<FormatPoolVO> getFormatPools() {
		return formatPools;
	}

	public void setFormatPools(List<FormatPoolVO> formatPools) {
		this.formatPools = formatPools;
	}

	public FormatPoolVO getFormatPool() {
		return formatPool;
	}

	public void setFormatPool(FormatPoolVO formatPool) {
		this.formatPool = formatPool;
	}

}
