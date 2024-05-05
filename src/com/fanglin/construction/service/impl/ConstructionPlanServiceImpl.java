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
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("constructionPlanService")
@Transactional(readOnly=true)
public class ConstructionPlanServiceImpl implements ConstructionPlanService{

	@Autowired
	private ConstructionPlanDao constructionPlanDao;

	@Override
	public List<ConstructionPlanVO> queryConstructionPlanByOrderId(ConstructionPlanVO constructionPlanVO) throws FLException {

		List<ConstructionPlanPO> constructionPlanPOs = constructionPlanDao.queryConstructionPlanByOrderId(constructionPlanVO.getOrderId());
		List<ConstructionPlanVO> constructionPlanVOs = new ArrayList<ConstructionPlanVO>();

		for (ConstructionPlanPO constructionPlanPO : constructionPlanPOs) {

			constructionPlanVO = new ConstructionPlanVO();

			BeanUtil.copyProperties(constructionPlanPO, constructionPlanVO);

			constructionPlanVOs.add(constructionPlanVO);
		}

		return constructionPlanVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		ConstructionPlanPO constructionPlanPO = new ConstructionPlanPO();

		constructionPlanPO.setOrderId(constructionPlanVO.getOrderId());
		constructionPlanPO.setName(constructionPlanVO.getName());
		constructionPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		constructionPlanPO.setStartTime(constructionPlanVO.getStartTime());
		constructionPlanPO.setEndTime(constructionPlanVO.getEndTime());
		constructionPlanPO.setComment(constructionPlanVO.getComment());

		constructionPlanDao.save(constructionPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException {

		constructionPlanDao.deleteById(constructionPlanVO.getCpid());
	}



}