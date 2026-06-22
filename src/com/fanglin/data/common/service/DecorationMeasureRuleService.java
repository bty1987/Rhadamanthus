package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.DecorationMeasureRuleItemVO;
import com.fanglin.data.common.vo.DecorationMeasureRuleVO;
import com.fanglin.utils.Paging;

public interface DecorationMeasureRuleService {

	public List<DecorationMeasureRuleVO> queryDecorationMeasureRule();

	public void pageDecorationMeasureRule(Paging paging, List<Filter> filters);

	public int addDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRuleVO);

	public int updateDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRuleVO);

	public void updateDecorationMeasureRuleForStatus(DecorationMeasureRuleVO decorationMeasureRuleVO);

	public int deleteDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRuleVO);

	public List<DecorationMeasureRuleItemVO> queryDecorationMeasureRuleItem(long dmrid);

	public int addDecorationMeasureRuleItem(DecorationMeasureRuleItemVO decorationMeasureRuleItemVO);

	public int deleteDecorationMeasureRuleItem(DecorationMeasureRuleItemVO decorationMeasureRuleItemVO);

}
