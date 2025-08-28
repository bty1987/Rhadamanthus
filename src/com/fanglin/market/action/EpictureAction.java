package com.fanglin.market.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.EpictureService;
import com.fanglin.market.vo.EpictureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EpictureAction extends BaseListAction {

	private static final long serialVersionUID = -3810784029009229248L;

	@Autowired
	private EpictureService epictureService;

	private List<EpictureVO> epictures;

	private EpictureVO epicture;

	@Action(value = "queryEpictureByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEpictureByCid() throws FLException {

		epictures = epictureService.queryEpictureByCid(epicture);

		return SUCCESS;
	}

	@Action(value = "queryEpicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEpicture() throws FLException {

		epictures = epictureService.queryEpictureByCid(epicture);

		return SUCCESS;
	}

	@Action(value = "addEpicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEpicture() throws FLException {

		epictureService.addEpicture(epicture);

		return SUCCESS;
	}

	@Action(value = "deleteEpicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteEpicture() throws FLException {

		epictureService.deleteEpicture(epicture);

		return SUCCESS;
	}

	public List<EpictureVO> getEpictures() {
		return epictures;
	}

	public void setEpictures(List<EpictureVO> epictures) {
		this.epictures = epictures;
	}

	public EpictureVO getEpicture() {
		return epicture;
	}

	public void setEpicture(EpictureVO epicture) {
		this.epicture = epicture;
	}

}
