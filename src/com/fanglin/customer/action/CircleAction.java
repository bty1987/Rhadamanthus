package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CircleService;
import com.fanglin.customer.vo.CircleDrawingVO;
import com.fanglin.customer.vo.CircleVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class CircleAction extends BaseListAction {

	private static final long serialVersionUID = -6385432330889201072L;

	@Autowired
	private CircleService circleService;

	private String unionId;

	private List<CircleDrawingVO> drawings;

	private CircleVO circle;

	private List<CircleVO> circles;

	private String userId;

	@Action(value = "pageCircleByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCircleByUnionId() throws FLException {

		circleService.pageCircleByUnionId(getPaging(), getFilters(), unionId);

		return SUCCESS;
	}

	@Action(value = "pageCircleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCircleByOrderId() throws FLException {

		circleService.pageCircleByOrderId(getPaging(), getFilters(), circle);

		return SUCCESS;
	}

	@Action(value = "updateCircleForPraise", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCircleForPraise() throws FLException {

		circleService.updateCircleForPraise(circle);

		return SUCCESS;
	}

	@Action(value = "addCircle", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCircle() throws FLException {

		circleService.addCircle(circle, drawings, userId);

		return SUCCESS;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public List<CircleDrawingVO> getDrawings() {
		return drawings;
	}

	public void setDrawings(List<CircleDrawingVO> drawings) {
		this.drawings = drawings;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public CircleVO getCircle() {
		return circle;
	}

	public void setCircle(CircleVO circle) {
		this.circle = circle;
	}

	public List<CircleVO> getCircles() {
		return circles;
	}

	public void setCircles(List<CircleVO> circles) {
		this.circles = circles;
	}

}
