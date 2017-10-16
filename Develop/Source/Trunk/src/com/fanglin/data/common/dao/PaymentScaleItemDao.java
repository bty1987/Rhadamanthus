package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.PaymentScaleItemPO;

public interface PaymentScaleItemDao extends Dao<PaymentScaleItemPO> {

	public List<PaymentScaleItemPO> queryPaymentScaleItemByPsid (long psid);

}
