package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionPaceNodeDao;
import com.fanglin.data.common.service.ConstructionPaceNodeService;
import com.fanglin.data.common.vo.ConstructionPaceNodeVO;
import com.fanglin.data.po.ConstructionPaceNodePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionPaceNodeService")
@Transactional(readOnly = true)
public class ConstructionPaceNodeServiceImpl implements ConstructionPaceNodeService {

	@Autowired
	private ConstructionPaceNodeDao constructionPaceNodeDao;

	@Override
	public void pageConstructionPaceNode(Paging paging, List<Filter> filters, int company) {

		List<ConstructionPaceNodePO> constructionPaceNodePOs = constructionPaceNodeDao.pageConstructionPaceNode(paging, filters, company);
		List<ConstructionPaceNodeVO> constructionPaceNodeVOs = new ArrayList<ConstructionPaceNodeVO>();

		for (ConstructionPaceNodePO constructionPaceNodePO : constructionPaceNodePOs) {
			constructionPaceNodeVOs.add(constructionPaceNodePO.ptv(new ConstructionPaceNodeVO()));
		}

		paging.setData(constructionPaceNodeVOs);
	}

	@Override
	public List<ConstructionPaceNodeVO> queryConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNodeVO) {

		List<ConstructionPaceNodePO> constructionPaceNodePOs = constructionPaceNodeDao.queryConstructionPaceNode(constructionPaceNodeVO.getCpid());
		List<ConstructionPaceNodeVO> constructionPaceNodeVOs = new ArrayList<ConstructionPaceNodeVO>();

		for (ConstructionPaceNodePO constructionPaceNodePO : constructionPaceNodePOs) {
			constructionPaceNodeVOs.add(constructionPaceNodePO.ptv(new ConstructionPaceNodeVO()));
		}

		return constructionPaceNodeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNodeVO, int company) {

		ConstructionPaceNodePO constructionPaceNodePO = new ConstructionPaceNodePO();

		BeanUtil.copyProperties(constructionPaceNodeVO, constructionPaceNodePO);

		constructionPaceNodePO.setCompany(company);

		constructionPaceNodeDao.save(constructionPaceNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNode) throws FLException {

		ConstructionPaceNodePO constructionPaceNodePO = constructionPaceNodeDao.get(constructionPaceNode.getCpid());

		if (constructionPaceNodePO == null) {
			throw new FLException(130123, "工程计划不存在");
		}

		BeanUtil.copyProperties(constructionPaceNode, constructionPaceNodePO);

		constructionPaceNodeDao.update(constructionPaceNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPaceNodeForStatus(ConstructionPaceNodeVO constructionPaceNode) throws FLException {

		ConstructionPaceNodePO constructionPaceNodePO = constructionPaceNodeDao.get(constructionPaceNode.getCpid());

		if (constructionPaceNodePO == null) {
			throw new FLException(130123, "工程计划不存在");
		}

		constructionPaceNodePO.setStatus(constructionPaceNode.getStatus());

		constructionPaceNodeDao.update(constructionPaceNodePO);
	}

}
