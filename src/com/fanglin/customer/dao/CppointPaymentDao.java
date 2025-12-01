package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CppointPaymentPO;

public interface CppointPaymentDao extends Dao<CppointPaymentPO> {

	public List<CppointPaymentPO> queryCppointPaymentByOrderId(String orderId);

	public void updateCppointPaymentByNo(String pointOrderId);

}
