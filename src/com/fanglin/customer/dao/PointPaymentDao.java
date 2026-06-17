package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.PointPaymentPO;

public interface PointPaymentDao extends Dao<PointPaymentPO> {

	public List<PointPaymentPO> queryPointPaymentByOrderId(String orderId);

	public void updatePointPaymentByNo(String pointOrderId);

}
