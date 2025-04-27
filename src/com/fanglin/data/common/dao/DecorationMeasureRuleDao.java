package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;
import com.fanglin.data.po.DecorationMeasureRulePO;

public interface DecorationMeasureRuleDao extends Dao<DecorationMeasureRulePO> {

	public List<DecorationMeasureRulePO> queryDecorationMeasureRule();

	public List<DecorationMeasureRuleItemPO> queryDecorationMeasureRule(int company);

}
