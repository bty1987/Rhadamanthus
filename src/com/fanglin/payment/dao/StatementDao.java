package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.StatementPO;
import com.fanglin.utils.Paging;

public interface StatementDao extends Dao<StatementPO> {

	public List<StatementPO> pageStatement(Paging paging, List<Filter> filters);

}
