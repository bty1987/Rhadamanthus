package com.fanglin.camera.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.camera.service.ConstructionCameraMediaService;
import com.fanglin.camera.vo.ConstructionCameraMediaVO;
import com.fanglin.camera.vo.ConstructionCameraPlayVO;
import com.fanglin.camera.vo.ConstructionCameraVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionCameraMediaAction extends BaseListAction {

	private static final long serialVersionUID = -3595627551480813615L;

	@Autowired
	private ConstructionCameraMediaService constructionCameraMediaService;

	private ConstructionCameraVO constructionCamera;

	private ConstructionCameraMediaVO constructionCameraMedia;

	private ConstructionCameraPlayVO constructionCameraPlay;

	private List<ConstructionCameraMediaVO> constructionCameraMedias;

	private String orderId;

	private String startTime;

	private String endTime;

	@Action(value = "queryConstructionCameraMedia", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionCameraMedia() throws FLException {

		constructionCameraMedias = constructionCameraMediaService.queryConstructionCameraMedia(constructionCameraMedia, startTime, endTime, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionCameraPlayList", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionCameraPlayList() throws FLException {

		constructionCameraMedias = constructionCameraMediaService.queryConstructionCameraPlayList(constructionCameraPlay, orderId, startTime, endTime, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "captureConstructionCamera", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String captureConstructionCamera() throws FLException {

		constructionCameraMedia = constructionCameraMediaService.captureConstructionCamera(constructionCamera, constructionCameraMedia, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ConstructionCameraVO getConstructionCamera() {
		return constructionCamera;
	}

	public void setConstructionCamera(ConstructionCameraVO constructionCamera) {
		this.constructionCamera = constructionCamera;
	}

	public ConstructionCameraMediaVO getConstructionCameraMedia() {
		return constructionCameraMedia;
	}

	public void setConstructionCameraMedia(ConstructionCameraMediaVO constructionCameraMedia) {
		this.constructionCameraMedia = constructionCameraMedia;
	}

	public ConstructionCameraPlayVO getConstructionCameraPlay() {
		return constructionCameraPlay;
	}

	public void setConstructionCameraPlay(ConstructionCameraPlayVO constructionCameraPlay) {
		this.constructionCameraPlay = constructionCameraPlay;
	}

	public List<ConstructionCameraMediaVO> getConstructionCameraMedias() {
		return constructionCameraMedias;
	}

	public void setConstructionCameraMedias(List<ConstructionCameraMediaVO> constructionCameraMedias) {
		this.constructionCameraMedias = constructionCameraMedias;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

}
