package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.utils.Paging;

public interface PaymentTypeDao extends Dao<PaymentTypePO> {

	public List<PaymentTypePO> pagePaymentType(Paging paging, List<Filter> filters, int company);

	public List<PaymentTypePO> queryPaymentType(Short type, Short paytype, Short bustype, Short atttype, int company);

	public PaymentTypePO queryPaymentTypeByName(String name, int company);

	public PaymentTypePO queryPaymentTypeByName(String name, Short type, Short paytype, Short bustype, Short atttype, int company);

}
