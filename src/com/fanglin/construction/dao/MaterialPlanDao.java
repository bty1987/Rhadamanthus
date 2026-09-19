package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.construction.po.MaterialPlanPO;

public interface MaterialPlanDao extends Dao<MaterialPlanPO> {

	public List<MaterialPlanPO> queryMaterialPlanByOrderId(String orderId);

	public List<MaterialPlanPO> queryMaterialPlanByOrderIds(List<String> orderIds);

	public int countMaterialPlan(String orderId);

	/**
	 * 履约回填-销售单链: [orderId, sid, createTime, category, bid, brandName], 仅有效单(status 0/5)
	 */
	public List<Object[]> queryMaterialSalesByOrderIds(List<String> orderIds);

	/**
	 * 履约回填-配送链: [orderId, sid, status, tranTime, confirmTime, deliveryBid, goodsBid, goodsCategory]
	 */
	public List<Object[]> queryMaterialDeliveryByOrderIds(List<String> orderIds);

	/**
	 * 履约回填-选材链: [orderId, status, tranTime, confirmTime, goodsBid, goodsCategory], status 1~6
	 */
	public List<Object[]> queryMaterialSelectionByOrderIds(List<String> orderIds);

}
