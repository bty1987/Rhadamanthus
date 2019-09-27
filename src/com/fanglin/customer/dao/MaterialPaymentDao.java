package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.utils.Paging;

public interface MaterialPaymentDao extends Dao<MaterialPaymentPO> {

	public List<MaterialPaymentPO> queryCusMaterialByOrderId(Paging paging, List<Filter> filters, String orderId);

	public long countCusMaterialPaymentForAmount(String orderId);

}
