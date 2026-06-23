package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.utils.Paging;

public interface DecorationAccountDao extends Dao<DecorationAccountPO> {

	public List<DecorationAccountPO> pageDecorationAccount(Paging paging, List<Filter> filters, int company) throws FLException;

	public DecorationAccountPO queryDecorationAccount(String orderId);

}
