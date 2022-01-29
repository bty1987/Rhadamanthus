package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationBalancePO;
import com.fanglin.utils.Paging;

public interface DecorationBalanceDao extends Dao<DecorationBalancePO> {

	public List<DecorationBalancePO> pageDecorationBalance(Paging paging, List<Filter> filters);

	public DecorationBalancePO queryDecorationBalance(Long doid);

}
