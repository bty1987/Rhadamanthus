/**
 * @File Name	: AcceptanceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionPlanDao;
import com.fanglin.construction.po.ConstructionPlanPO;
import com.fanglin.construction.service.ConstructionPlanService;
import com.fanglin.construction.vo.ConstructionPlanVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionPaceDao;
import com.fanglin.data.common.dao.ConstructionPaceNodeDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.common.vo.ConstructionPaceNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.ConstructionPaceNodePO;
import com.fanglin.data.po.ConstructionPacePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("constructionPlanService")
@Transactional(readOnly = true)
public class ConstructionPlanServiceImpl implements ConstructionPlanService {

	@Autowired
	private ConstructionPlanDao constructionPlanDao;

	@Autowired
	private ConstructionPaceDao constructionPaceDao;

	@Autowired
	private ConstructionPaceNodeDao constructionPaceNodeDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public List<ConstructionPlanVO> queryConstructionPlanByOrderId(ConstructionPlanVO constructionPlanVO) throws FLException {

		List<ConstructionPlanPO> constructionPlanPOs = constructionPlanDao.queryConstructionPlanByOrderId(constructionPlanVO.getOrderId());
		List<ConstructionPlanVO> constructionPlanVOs = new ArrayList<ConstructionPlanVO>();

		for (ConstructionPlanPO constructionPlanPO : constructionPlanPOs) {
			constructionPlanVOs.add(constructionPlanPO.ptv(new ConstructionPlanVO(new ConstructionPaceNodeVO(new ConstructionNodeVO()), new ConstructionNodeVO())));
		}

		return constructionPlanVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void makeConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionPlanVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (constructionPlanDao.countConstructionPlan(constructionPlanVO.getOrderId()) > 0) return;

		ConstructionPacePO constructionPacePO = constructionPaceDao.queryConstructionPace(decorationPO.getHouse().getInnerArea(), decorationPO.getCompany());

		if (constructionPacePO == null) return;

		int sort = 0;

		List<ConstructionPaceNodePO> constructionPaceNodePOs = constructionPaceNodeDao.queryConstructionPaceNode(constructionPacePO.getCpid());

		for (ConstructionPaceNodePO constructionPaceNodePO : constructionPaceNodePOs) {

			ConstructionPlanPO constructionPlanPO = new ConstructionPlanPO();

			BeanUtil.copyProperties(constructionPlanVO, constructionPlanPO, Arrays.asList("pace"));

			constructionPlanPO.setOrderId(constructionPlanVO.getOrderId());
			constructionPlanPO.setName(constructionPaceNodePO.getName());
			constructionPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			constructionPlanPO.setPacenode(constructionPaceNodePO);

			constructionPlanPO.setConnum(constructionPaceNodePO.getConnum());
			constructionPlanPO.setComnum(constructionPaceNodePO.getComnum());

			constructionPlanPO.setPostnum(constructionPaceNodePO.getPostnum());
			constructionPlanPO.setPrenum(constructionPaceNodePO.getPrenum());

			constructionPlanPO.setContent(constructionPaceNodePO.getContent());
			constructionPlanPO.setComment(constructionPaceNodePO.getComment());

			if (constructionPaceNodePO.getNode() != null) constructionPlanPO.setNode(new ConstructionNodePO(constructionPaceNodePO.getNode().getCnid()));

			constructionPlanPO.setSort(sort);

			constructionPlanDao.save(constructionPlanPO);

			sort++;
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		ConstructionPaceNodePO constructionPaceNodePO = constructionPaceNodeDao.get(constructionPlanVO.getCpid());

		if (constructionPaceNodePO == null) {
			throw new FLException(120037, "工程计划不存在");
		}

		int sort = constructionPlanDao.countConstructionPlan(constructionPlanVO.getOrderId());

		ConstructionPlanPO constructionPlanPO = new ConstructionPlanPO();

		BeanUtil.copyProperties(constructionPlanVO, constructionPlanPO, Arrays.asList("pace"));

		constructionPlanPO.setOrderId(constructionPlanVO.getOrderId());
		constructionPlanPO.setName(constructionPaceNodePO.getName());
		constructionPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		if (constructionPaceNodePO.getNode() != null) constructionPlanPO.setNode(new ConstructionNodePO(constructionPaceNodePO.getNode().getCnid()));

		constructionPlanPO.setConnum(constructionPaceNodePO.getConnum());
		constructionPlanPO.setComnum(constructionPaceNodePO.getComnum());
		constructionPlanPO.setPostnum(constructionPaceNodePO.getPostnum());
		constructionPlanPO.setPrenum(constructionPaceNodePO.getPrenum());
		constructionPlanPO.setPhase(constructionPaceNodePO.getPhase());
		constructionPlanPO.setMaterial(constructionPaceNodePO.getMaterial());
		constructionPlanPO.setPeriod(constructionPaceNodePO.getPeriod());

		constructionPlanPO.setContent(constructionPaceNodePO.getContent());
		constructionPlanPO.setComment(constructionPlanVO.getComment());

		constructionPlanPO.setSort(sort);

		constructionPlanDao.save(constructionPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		ConstructionPlanPO constructionPlanPO = constructionPlanDao.get(constructionPlanVO.getCpid());

		if (constructionPlanPO == null) {
			throw new FLException(120037, "工程计划不存在");
		}

		constructionPlanPO.setConnum(constructionPlanVO.getConnum());
		constructionPlanPO.setComnum(constructionPlanVO.getComnum());
		constructionPlanPO.setContent(constructionPlanVO.getContent());
		constructionPlanPO.setComment(constructionPlanVO.getComment());
		constructionPlanPO.setPostnum(constructionPlanVO.getPostnum());
		constructionPlanPO.setPrenum(constructionPlanVO.getPrenum());

		constructionPlanDao.update(constructionPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void moveConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		ConstructionPlanPO constructionPlanPO = constructionPlanDao.get(constructionPlanVO.getCpid());

		if (constructionPlanPO == null) {
			throw new FLException(120037, "工程计划不存在");
		}

		int sort = constructionPlanVO.getSort();

		if (sort <= 0) return;
		if (sort > constructionPlanDao.countConstructionPlan(constructionPlanPO.getOrderId())) return;

		ConstructionPlanPO constructionPlanOO = constructionPlanDao.queryConstructionPlan(constructionPlanPO.getOrderId(), sort);

		if (constructionPlanOO != null) {

			constructionPlanOO.setSort(constructionPlanPO.getSort());

			constructionPlanDao.update(constructionPlanOO);
		}

		constructionPlanPO.setSort(constructionPlanVO.getSort());

		constructionPlanDao.update(constructionPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		constructionPlanDao.deleteById(constructionPlanVO.getCpid());
	}

}