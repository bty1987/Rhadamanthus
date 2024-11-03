package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.OalesBO;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.utils.Paging;

public interface OalesDao extends Dao<OalesPO> {

	public List<OalesPO> pageOales(Paging paging, List<Filter> filters, List<Short> statuses, int company) throws FLException;

	public List<OalesPO> pageOalesForAccount(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<OalesBO> queryOalesByOrderId(String orderId);

	public Long amountOales(String orderId, Short isScale);

}
