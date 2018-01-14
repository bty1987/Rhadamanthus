package com.fanglin.data.common.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.PaymentScalePO;

public interface PaymentScaleDao extends Dao<PaymentScalePO> {
	
	public List<PaymentScalePO> queryPaymentScaleByCid(int cid);

}
