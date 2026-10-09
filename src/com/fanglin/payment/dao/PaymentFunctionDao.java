package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaymentFunctionPO;
import com.fanglin.utils.Paging;

public interface PaymentFunctionDao extends Dao<PaymentFunctionPO> {

	public List<PaymentFunctionPO> pagePaymentFunction(Paging paging, List<Filter> filters);

	public List<PaymentFunctionPO> queryPaymentFunction(Short type);

	public List<PaymentFunctionPO> queryPaymentFunctionByName(String name);

	public long countPaymentFunctionRightByPfid(long pfid);

}
