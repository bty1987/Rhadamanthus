package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesOperatePO;

public interface SalesOperateDao extends Dao<SalesOperatePO> {

	public List<SalesOperatePO> querySalesOperateBySid(long sid);

}
