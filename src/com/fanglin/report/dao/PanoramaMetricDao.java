package com.fanglin.report.dao;

import com.fanglin.report.vo.OrderPanoramaVO;

/**
 * 订单全景穿透 DAO（一户穿透）。
 *
 * <p>单订单实时只读查询（非汇总表），跨 5 库聚合：decoration/quotation/construction/payment/sales。
 */
public interface PanoramaMetricDao {

	/** 按订单号查询全生命周期数据，订单不存在返回 null。 */
	OrderPanoramaVO queryOrderPanorama(String orderId);

}
