package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.ComplainPO;
import com.fanglin.utils.Paging;

public interface ComplainDao extends Dao<ComplainPO> {

	public List<ComplainPO> pageComplain(Paging paging, List<Filter> filters, int company);

	public List<ComplainPO> queryComplain(long csid);

	public List<ComplainPO> queryComplainByOrderId(String orderId);

}
