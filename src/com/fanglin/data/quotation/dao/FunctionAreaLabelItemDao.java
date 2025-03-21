package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaLabelItemPO;

public interface FunctionAreaLabelItemDao extends Dao<FunctionAreaLabelItemPO> {

	public List<FunctionAreaLabelItemPO> queryFunctionAreaLabelItem(long qiid);

}
