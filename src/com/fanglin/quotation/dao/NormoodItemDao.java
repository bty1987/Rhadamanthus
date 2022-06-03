package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormoodItemPO;

public interface NormoodItemDao extends Dao<NormoodItemPO> {

	public List<NormoodItemPO> queryNormoodItem(long qid);

}
