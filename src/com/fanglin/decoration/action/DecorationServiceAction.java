package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.decoration.service.DecorationServiceService;
import com.fanglin.decoration.vo.DecorationPictureVO;
import com.fanglin.decoration.vo.DecorationServiceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationServiceAction extends BaseListAction {

	private static final long serialVersionUID = 1515051131753670098L;

	@Autowired
	private DecorationServiceService decorationServiceService;

	private List<DecorationServiceVO> decorationServices;

	private DecorationServiceVO decorationService;

	// 设计确认相关VO
	private DecorationPictureVO decorationPicture;

	// 批量操作参数
	private String dpids;  // 图片ID列表，逗号分隔
	private short status;   // 目标状态

	@Action(value = "pageDecorationService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationService() throws FLException {

		decorationServiceService.pageDecorationService(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}

	@Action(value = "queryDecorationServiceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationServiceByOrderId() {

		decorationServices = decorationServiceService.queryDecorationServiceByOrderId(decorationService);

		return SUCCESS;
	}

	@Action(value = "addDecorationService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationService() throws FLException {

		decorationServiceService.addDecortionService(decorationService, authentication());

		return SUCCESS;
	}

	@Action(value = "completeDecorationService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String completeDecorationService() throws FLException {

		decorationServiceService.completeDecorationService(decorationService);

		return SUCCESS;
	}

	// ==================== 设计确认相关接口 ====================

	/**
	 * 创建设计确认记录
	 */
	@Action(value = "createDesignConfirmation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createDesignConfirmation() throws FLException {
		long dsid = decorationServiceService.createDesignConfirmationForPictureByOrderId(
				decorationService, authentication());
		decorationService.setDsid(dsid);
		return SUCCESS;
	}

	/**
	 * 提交设计确认
	 */
	@Action(value = "submitDesignConfirmation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitDesignConfirmation() throws FLException {
		decorationServiceService.submitDesignConfirmationForResultByDsid(
				decorationService, authentication());
		return SUCCESS;
	}

	/**
	 * 查询设计确认历史
	 */
	@Action(value = "queryDesignConfirmationHistory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDesignConfirmationHistory() {
		decorationServices = decorationServiceService.queryDesignConfirmationHistoryForByOrderId(
				decorationService.getOrderId());
		return SUCCESS;
	}

	/**
	 * 切换图片展示状态
	 */
	@Action(value = "toggleDecorationPictureForShowStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String toggleDecorationPictureForShowStatus() throws FLException {
		decorationServiceService.toggleDecorationPictureForShowStatusByOrderIdAndDpid(
				decorationService.getOrderId(),
				decorationPicture.getDpId(),
				decorationPicture.getStatus());
		return SUCCESS;
	}

	/**
	 * 批量切换图片展示状态
	 */
	@Action(value = "batchToggleDecorationPictureForShowStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchToggleDecorationPictureForShowStatus() throws FLException {
		int count = decorationServiceService.batchToggleDecorationPictureForShowStatusByOrderIdAndDpids(
				decorationService.getOrderId(),
				dpids,
				status);
		// 返回更新数量
		try {
			getResponse().setContentType("application/json");
			getResponse().getWriter().write(
					"{\"errorCode\":0,\"errorMsg\":\"成功更新 " + count + " 张图片状态\",\"affectedCount\":" + count + "}");
		} catch (Exception e) {
			// ignore
		}
		return NONE;
	}

	public List<DecorationServiceVO> getDecorationServices() {
		return decorationServices;
	}

	public void setDecorationServices(List<DecorationServiceVO> decorationServices) {
		this.decorationServices = decorationServices;
	}

	public DecorationServiceVO getDecorationService() {
		return decorationService;
	}

	public void setDecorationService(DecorationServiceVO decorationService) {
		this.decorationService = decorationService;
	}

	public DecorationPictureVO getDecorationPicture() {
		return decorationPicture;
	}

	public void setDecorationPicture(DecorationPictureVO decorationPicture) {
		this.decorationPicture = decorationPicture;
	}

	public String getDpids() {
		return dpids;
	}

	public void setDpids(String dpids) {
		this.dpids = dpids;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
