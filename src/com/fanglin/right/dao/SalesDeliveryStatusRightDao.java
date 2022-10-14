package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.SalesDeliveryStatusRightPO;

public interface SalesDeliveryStatusRightDao extends Dao<SalesDeliveryStatusRightPO> {

	public List<SalesDeliveryStatusRightPO> querySalesDeliveryStatusRight(long bid);

	public void deleteSalesDeliveryStatus(Long bid);
}
