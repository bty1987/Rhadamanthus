package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.PaymentScaleItemPO;

public interface PaymentScaleItemDao extends Dao<PaymentScaleItemPO> {

	public List<PaymentScaleItemPO> queryPaymentScaleItemByPsid(long psid);

	public List<PaymentScaleItemPO> fetchPaymentScaleItem(Long ptid, Short typeness, Short atttype, Long dbid);

	public PaymentScaleItemPO queryPaymentScaleItem(long ptid, short typeness, short atttype, long dbid);

}
