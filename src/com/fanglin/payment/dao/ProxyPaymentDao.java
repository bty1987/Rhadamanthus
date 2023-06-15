package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.ProxyPaymentPO;
import com.fanglin.utils.Paging;

public interface ProxyPaymentDao extends Dao<ProxyPaymentPO> {

	public List<ProxyPaymentPO> pageProxyPayment(Paging paging, List<Filter> filters);

	public List<ProxyPaymentPO> queryProxyPaymentByPpids(List<Long> ppids);

}
