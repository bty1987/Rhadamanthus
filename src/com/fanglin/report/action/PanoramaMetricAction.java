package com.fanglin.report.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.PanoramaMetricService;
import com.fanglin.report.vo.OrderPanoramaVO;

/**
 * 订单全景穿透报表入口（一户穿透）。
 *
 * <p>输入订单号，实时聚合展示 5 个业务域的全生命周期数据：
 * 订单(decoration)/报价(quotation)/施工(construction)/收款(payment)/主材(sales)。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class PanoramaMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private PanoramaMetricService panoramaMetricService;

	private String orderId;

	private OrderPanoramaVO panorama;

	@Action(value = "queryOrderPanorama", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderPanorama() throws FLException {

		panorama = panoramaMetricService.queryOrderPanorama(orderId);

		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public OrderPanoramaVO getPanorama() {
		return panorama;
	}

	public void setPanorama(OrderPanoramaVO panorama) {
		this.panorama = panorama;
	}

}
