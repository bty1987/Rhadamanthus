package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.DroupPO;
import com.fanglin.utils.Paging;

public interface DroupDao extends Dao<DroupPO> {

	public List<DroupPO> pageDroup(Paging paging, List<Filter> filters);

	public DroupPO queryDroup(String orderId, String chatId, String openId);

}
