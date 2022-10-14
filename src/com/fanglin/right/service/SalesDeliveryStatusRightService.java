package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.SalesDeliveryStatusRightVO;

public interface SalesDeliveryStatusRightService {

	public List<SalesDeliveryStatusRightVO> querySalesDeliveryStatusRight(SalesDeliveryStatusRightVO salesDeliveryStatusRight);

	public void updateSalesDeliveryStatusRight(List<SalesDeliveryStatusRightVO> salesDeliveryStatusRights);

}
