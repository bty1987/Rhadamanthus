package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.dao.ConstructionPaceNodeDao;
import com.fanglin.data.common.service.ConstructionPaceNodeService;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.common.vo.ConstructionPaceNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.ConstructionPaceNodePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionPaceNodeService")
@Transactional(readOnly = true)
public class ConstructionPaceNodeServiceImpl implements ConstructionPaceNodeService {

	@Autowired
	private ConstructionPaceNodeDao constructionPaceNodeDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;
	@Override
	public void pageConstructionPaceNode(Paging paging, List<Filter> filters, int company, ConstructionPaceNodeVO constructionPaceNode) {

		List<ConstructionPaceNodePO> constructionPaceNodePOs = constructionPaceNodeDao.pageConstructionPaceNode(paging, filters, company, constructionPaceNode.getCpid());
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
			constructionPaceNodeVOs.add(constructionPaceNodePO.ptv(new ConstructionPaceNodeVO(new ConstructionNodeVO())));
		}

		return constructionPaceNodeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNodeVO, int company) throws FLException {

		ConstructionPaceNodePO constructionPaceNodePO = new ConstructionPaceNodePO();

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionPaceNodeVO.getNode().getCnid());
		
		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		BeanUtil.copyProperties(constructionPaceNodeVO, constructionPaceNodePO);

		constructionPaceNodePO.setNode(constructionNodePO);

		constructionPaceNodePO.setCompany(company);

		constructionPaceNodeDao.save(constructionPaceNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNode) throws FLException {

		ConstructionPaceNodePO constructionPaceNodePO = constructionPaceNodeDao.get(constructionPaceNode.getCpnid());

		if (constructionPaceNodePO == null) {
			throw new FLException(130123, "工程计划不存在");
		}

		BeanUtil.copyProperties(constructionPaceNode, constructionPaceNodePO);

		constructionPaceNodeDao.update(constructionPaceNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPaceNodeForStatus(ConstructionPaceNodeVO constructionPaceNode) throws FLException {

		ConstructionPaceNodePO constructionPaceNodePO = constructionPaceNodeDao.get(constructionPaceNode.getCpnid());

		if (constructionPaceNodePO == null) {
			throw new FLException(130123, "工程计划不存在");
		}

		constructionPaceNodePO.setStatus(constructionPaceNode.getStatus());

		constructionPaceNodeDao.update(constructionPaceNodePO);
	}

}
