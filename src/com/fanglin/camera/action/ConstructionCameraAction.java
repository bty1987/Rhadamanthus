package com.fanglin.camera.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.camera.service.ConstructionCameraService;
import com.fanglin.camera.vo.ConstructionCameraLiveVO;
import com.fanglin.camera.vo.ConstructionCameraVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionCameraAction extends BaseListAction {

	private static final long serialVersionUID = 8234628081688751904L;

	@Autowired
	private ConstructionCameraService constructionCameraService;

	private ConstructionCameraVO constructionCamera;

	private List<ConstructionCameraVO> constructionCameras;

	private ConstructionCameraLiveVO constructionCameraLive;

	private String protocol;

	@Action(value = "pageConstructionCamera", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionCamera() throws FLException {

		constructionCameraService.pageConstructionCamera(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionCameraByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionCameraByOrderId() throws FLException {

		constructionCameras = constructionCameraService.queryConstructionCameraByOrderId(constructionCamera, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionCameraLiveUrl", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionCameraLiveUrl() throws FLException {

		constructionCameraLive = constructionCameraService.queryConstructionCameraLiveUrl(constructionCamera, protocol, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addConstructionCamera", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionCamera() throws FLException {

		constructionCameraService.addConstructionCamera(constructionCamera, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionCamera", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionCamera() throws FLException {

		constructionCameraService.updateConstructionCamera(constructionCamera, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionCameraForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionCameraForStatus() throws FLException {

		constructionCameraService.updateConstructionCameraForStatus(constructionCamera, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionCameraForVisible", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionCameraForVisible() throws FLException {

		constructionCameraService.updateConstructionCameraForVisible(constructionCamera, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteConstructionCamera", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructionCamera() throws FLException {

		constructionCameraService.deleteConstructionCamera(constructionCamera, queryCompany());

		return SUCCESS;
	}

	public ConstructionCameraVO getConstructionCamera() {
		return constructionCamera;
	}

	public void setConstructionCamera(ConstructionCameraVO constructionCamera) {
		this.constructionCamera = constructionCamera;
	}

	public List<ConstructionCameraVO> getConstructionCameras() {
		return constructionCameras;
	}

	public void setConstructionCameras(List<ConstructionCameraVO> constructionCameras) {
		this.constructionCameras = constructionCameras;
	}

	public ConstructionCameraLiveVO getConstructionCameraLive() {
		return constructionCameraLive;
	}

	public void setConstructionCameraLive(ConstructionCameraLiveVO constructionCameraLive) {
		this.constructionCameraLive = constructionCameraLive;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

}
