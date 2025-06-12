package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.common.service.DecorationMeasureRuleService;
import com.fanglin.data.common.vo.DecorationMeasureRuleVO;
import com.fanglin.data.po.DecorationMeasureRulePO;
import com.fanglin.utils.BeanUtil;

@Service("decorationMeasureRuleService")
@Transactional(readOnly = true)
public class DecorationMeasureRuleServiceImpl implements DecorationMeasureRuleService {

	@Autowired
	private DecorationMeasureRuleDao decorationMeasureRuleDao;

	@Override
	public List<DecorationMeasureRuleVO> queryDecorationMeasureRule() {

		List<DecorationMeasureRulePO> decorationMeasureRulePOs = decorationMeasureRuleDao.queryDecorationMeasureRule();
		List<DecorationMeasureRuleVO> decorationMeasureRuleVOs = new ArrayList<DecorationMeasureRuleVO>();

		for (DecorationMeasureRulePO decorationMeasureRulePO : decorationMeasureRulePOs) {

			DecorationMeasureRuleVO decorationMeasureRuleVO = new DecorationMeasureRuleVO();

			BeanUtil.copyProperties(decorationMeasureRulePO, decorationMeasureRuleVO);

			decorationMeasureRuleVOs.add(decorationMeasureRuleVO);
		}

		return decorationMeasureRuleVOs;
	}

}
