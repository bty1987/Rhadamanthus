package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.utils.Paging;

public interface DecorationUserDao extends Dao<DecorationUserPO> {

	public List<DecorationPO> pageDecorationForUser(Paging paging, List<Filter> filters, int uid) throws FLException;

	public List<DecorationUserPO> queryDecorationUser(Paging paging, List<Filter> filters, String orderId, Short isShow);

	public long countDecorationUser(String orderId, int user, Short type);

}
