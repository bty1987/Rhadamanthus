package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.PointofsalesService;
import com.fanglin.payment.vo.PointofsalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PointofsalesAction extends BaseListAction {

	private static final long serialVersionUID = 2664725104672617015L;

	@Autowired
	private PointofsalesService pointofsalesService;

	private List<PointofsalesVO> pointofsaleses;

	private PointofsalesVO pointofsales;

	@Action(value = "queryPointofsalesByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPointofsalesByPid() throws FLException {

		pointofsaleses = pointofsalesService.queryPointofsalesByPid(pointofsales);

		return SUCCESS;
	}

	@Action(value = "addPointofsales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPointofsales() throws FLException {

		pointofsalesService.addPointofsales(pointofsales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkPointofsales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkPointofsales() throws FLException {

		pointofsalesService.checkPointofsales(pointofsales);

		return SUCCESS;
	}

	@Action(value = "cancelPointofsales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelPointofsales() throws FLException {

		pointofsalesService.cancelPointofsales(pointofsales);

		return SUCCESS;
	}

	public List<PointofsalesVO> getPointofsaleses() {
		return pointofsaleses;
	}

	public void setPointofsaleses(List<PointofsalesVO> pointofsaleses) {
		this.pointofsaleses = pointofsaleses;
	}

	public PointofsalesVO getPointofsales() {
		return pointofsales;
	}

	public void setPointofsales(PointofsalesVO pointofsales) {
		this.pointofsales = pointofsales;
	}

}
