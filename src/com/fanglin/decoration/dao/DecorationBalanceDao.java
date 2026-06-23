package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationBalancePO;
import com.fanglin.utils.Paging;

public interface DecorationBalanceDao extends Dao<DecorationBalancePO> {

	public List<DecorationBalancePO> pageDecorationForBalance(Paging paging, List<Filter> filters, int company) throws FLException;

	public DecorationBalancePO queryDecorationBalance(Long doid);

}
