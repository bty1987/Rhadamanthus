package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.construction.po.MaterialPlanPO;

public interface MaterialPlanDao extends Dao<MaterialPlanPO> {

	public List<MaterialPlanPO> queryMaterialPlanByOrderId(String orderId);

	public int countMaterialPlan(String orderId);

	/**
	 * 履约回填-销售单链: [sid, createTime, category, bid, brandName], 仅有效单(status 0/5)
	 */
	public List<Object[]> queryMaterialSalesByOrderId(String orderId);

	/**
	 * 履约回填-配送链: [sid, status, tranTime, confirmTime, deliveryBid, goodsBid, goodsCategory]
	 */
	public List<Object[]> queryMaterialDeliveryByOrderId(String orderId);

	/**
	 * 履约回填-选材链: [status, tranTime, confirmTime, goodsBid, goodsCategory], status 1~6
	 */
	public List<Object[]> queryMaterialSelectionByOrderId(String orderId);

}
