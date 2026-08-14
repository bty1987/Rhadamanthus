package com.fanglin.report.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.vo.OrderPanoramaVO;

/**
 * 订单全景穿透服务。
 */
public interface PanoramaMetricService {

	/** 按订单号查询全生命周期数据，订单不存在抛 FLException。 */
	OrderPanoramaVO queryOrderPanorama(String orderId) throws FLException;

}
