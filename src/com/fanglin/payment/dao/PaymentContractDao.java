package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaymentContractPO;
import com.fanglin.utils.Paging;

public interface PaymentContractDao extends Dao<PaymentContractPO> {

	PaymentContractPO queryPaymentContract(long rtid, short type);
	
	public List<PaymentContractPO> pagePaymentContract(Paging paging, List<Filter> filters);
}
