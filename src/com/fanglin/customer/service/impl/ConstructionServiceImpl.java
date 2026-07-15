package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ConstructionService;
import com.fanglin.customer.vo.ConstructionScheduleVO;
import com.fanglin.customer.vo.ConstructionVO;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;

@Service("constructionOrderService")
@Transactional(readOnly = true)
public class ConstructionServiceImpl implements ConstructionService {

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public ConstructionVO queryCusConstruction(String orderId) {

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);
		ConstructionVO constructionVO = new ConstructionVO();

		if (constructionPO != null) {

			constructionVO.setCid(constructionPO.getCid());
			constructionVO.setCreateTime(constructionPO.getStartTime());
			constructionVO.setOrderId(orderId);
		}

		return constructionVO;
	}

	@Override
	public List<ConstructionScheduleVO> queryCusConstructionSchedule(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNode(decorationPO.getCompany());
		Map<Short, String> nodes = new HashMap<Short, String>();

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			nodes.put(constructionNodePO.getSort(), constructionNodePO.getName());
		}

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();

		ConstructionScheduleVO constructionSchedule;

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {

			constructionSchedule = new ConstructionScheduleVO();

			BeanUtil.copyProperties(constructionSchedulePO, constructionSchedule);

			if (nodes.containsKey(constructionSchedulePO.getSchedule())) {
				constructionSchedule.setNode(nodes.get(constructionSchedulePO.getSchedule()));
			}

			constructionScheduleVOs.add(constructionSchedule);
		}

		return constructionScheduleVOs;
	}

}
