package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.common.dao.DecorationMeasureRuleItemDao;
import com.fanglin.data.common.service.DecorationMeasureRuleService;
import com.fanglin.data.common.vo.DecorationMeasureRuleItemVO;
import com.fanglin.data.common.vo.DecorationMeasureRuleVO;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;
import com.fanglin.data.po.DecorationMeasureRulePO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationMeasureRuleService")
@Transactional(readOnly = true)
public class DecorationMeasureRuleServiceImpl implements DecorationMeasureRuleService {

	@Autowired
	private DecorationMeasureRuleDao decorationMeasureRuleDao;

	@Autowired
	private DecorationMeasureRuleItemDao decorationMeasureRuleItemDao;

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

	@Override
	public void pageDecorationMeasureRule(Paging paging, List<Filter> filters) {

		List<DecorationMeasureRulePO> decorationMeasureRulePOs = decorationMeasureRuleDao.pageDecorationMeasureRule(paging, filters);
		List<DecorationMeasureRuleVO> decorationMeasureRuleVOs = new ArrayList<DecorationMeasureRuleVO>();

		for (DecorationMeasureRulePO decorationMeasureRulePO : decorationMeasureRulePOs) {

			DecorationMeasureRuleVO decorationMeasureRuleVO = new DecorationMeasureRuleVO();

			BeanUtil.copyProperties(decorationMeasureRulePO, decorationMeasureRuleVO);

			decorationMeasureRuleVOs.add(decorationMeasureRuleVO);
		}

		paging.setData(decorationMeasureRuleVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRuleVO) {

		DecorationMeasureRulePO decorationMeasureRulePO = new DecorationMeasureRulePO();

		BeanUtil.copyProperties(decorationMeasureRuleVO, decorationMeasureRulePO);

		decorationMeasureRulePO.setStatus(DecorationMeasureRulePO.STATUS_ENABLE_SHORT);

		decorationMeasureRuleDao.save(decorationMeasureRulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRuleVO) {

		DecorationMeasureRulePO decorationMeasureRulePO = decorationMeasureRuleDao.get(decorationMeasureRuleVO.getDmrid());

		if (decorationMeasureRulePO == null) {
			return 0;
		}

		BeanUtil.copyPropertie(decorationMeasureRuleVO, decorationMeasureRulePO);

		decorationMeasureRuleDao.update(decorationMeasureRulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationMeasureRuleForStatus(DecorationMeasureRuleVO decorationMeasureRuleVO) {

		DecorationMeasureRulePO decorationMeasureRulePO = decorationMeasureRuleDao.get(decorationMeasureRuleVO.getDmrid());

		if (decorationMeasureRulePO == null) {
			return;
		}

		decorationMeasureRulePO.setStatus(decorationMeasureRuleVO.getStatus());

		decorationMeasureRuleDao.update(decorationMeasureRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRuleVO) {

		DecorationMeasureRulePO decorationMeasureRulePO = decorationMeasureRuleDao.get(decorationMeasureRuleVO.getDmrid());

		if (decorationMeasureRulePO == null) {
			return 0;
		}

		decorationMeasureRuleDao.delete(decorationMeasureRulePO);

		return 0;
	}

	@Override
	public List<DecorationMeasureRuleItemVO> queryDecorationMeasureRuleItem(long dmrid) {

		List<DecorationMeasureRuleItemPO> decorationMeasureRuleItemPOs = decorationMeasureRuleItemDao.queryDecorationMeasureRuleItem(dmrid);
		List<DecorationMeasureRuleItemVO> decorationMeasureRuleItemVOs = new ArrayList<DecorationMeasureRuleItemVO>();

		for (DecorationMeasureRuleItemPO decorationMeasureRuleItemPO : decorationMeasureRuleItemPOs) {

			DecorationMeasureRuleItemVO decorationMeasureRuleItemVO = new DecorationMeasureRuleItemVO();

			BeanUtil.copyProperties(decorationMeasureRuleItemPO, decorationMeasureRuleItemVO);

			decorationMeasureRuleItemVOs.add(decorationMeasureRuleItemVO);
		}

		return decorationMeasureRuleItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationMeasureRuleItem(DecorationMeasureRuleItemVO decorationMeasureRuleItemVO) {

		DecorationMeasureRuleItemPO decorationMeasureRuleItemPO = new DecorationMeasureRuleItemPO();

		BeanUtil.copyProperties(decorationMeasureRuleItemVO, decorationMeasureRuleItemPO);

		decorationMeasureRuleItemDao.save(decorationMeasureRuleItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationMeasureRuleItem(DecorationMeasureRuleItemVO decorationMeasureRuleItemVO) {

		DecorationMeasureRuleItemPO decorationMeasureRuleItemPO = decorationMeasureRuleItemDao.get(decorationMeasureRuleItemVO.getDmriid());

		if (decorationMeasureRuleItemPO != null) {
			decorationMeasureRuleItemDao.delete(decorationMeasureRuleItemPO);
		}

		return 0;
	}

}
