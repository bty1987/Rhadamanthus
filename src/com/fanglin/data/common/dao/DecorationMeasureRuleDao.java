package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;
import com.fanglin.data.po.DecorationMeasureRulePO;
import com.fanglin.utils.Paging;

public interface DecorationMeasureRuleDao extends Dao<DecorationMeasureRulePO> {

	public List<DecorationMeasureRulePO> queryDecorationMeasureRule();

	public List<DecorationMeasureRuleItemPO> queryDecorationMeasureRule(int company);

	public List<DecorationMeasureRulePO> pageDecorationMeasureRule(Paging paging, List<Filter> filters);

}
