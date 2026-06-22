package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;

public interface DecorationMeasureRuleItemDao extends Dao<DecorationMeasureRuleItemPO> {

	public List<DecorationMeasureRuleItemPO> queryDecorationMeasureRuleItem(long dmrid);

}
