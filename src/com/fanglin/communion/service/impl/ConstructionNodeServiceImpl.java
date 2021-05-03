package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstructionNodeDao;
import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.communion.service.ConstructionNodeService;
import com.fanglin.communion.vo.ConstructionNodeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionNodeService")
@Transactional(readOnly = true)
public class ConstructionNodeServiceImpl implements ConstructionNodeService {

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageConstructionNode(Paging paging, List<Filter> filters, int company) {

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.pageConstructionNode(paging, filters, company);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();

		ConstructionNodeVO constructionNodeVO;

		if (constructionNodePOs != null) {
			for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
				constructionNodeVO = new ConstructionNodeVO();

				BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);

				constructionNodeVOs.add(constructionNodeVO);
			}
		}

		paging.setData(constructionNodeVOs);

	}

	@Override
	public List<ConstructionNodeVO> queryConstructionNode(int company) {

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNode(company);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();

		ConstructionNodeVO constructionNodeVO;

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			constructionNodeVO = new ConstructionNodeVO();

			BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);

			constructionNodeVOs.add(constructionNodeVO);
		}

		return constructionNodeVOs;
	}

	@Override
	public List<ConstructionNodeVO> queryConstructionNodeByOrderId(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNode(decorationPO.getCompany());
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();

		ConstructionNodeVO constructionNodeVO;

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			constructionNodeVO = new ConstructionNodeVO();

			BeanUtil.copyProperties(constructionNodePO, constructionNodeVO);

			constructionNodeVOs.add(constructionNodeVO);
		}

		return constructionNodeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionNode(ConstructionNodeVO constructionNodeVO) {

		ConstructionNodePO constructionNodePO = new ConstructionNodePO();

		constructionNodePO.setName(constructionNodeVO.getName());
		
		constructionNodePO.setPrecheck(0);
		constructionNodePO.setPostcheck(0);
		constructionNodePO.setStacheck(0);
		constructionNodePO.setFincheck(0);
		
		constructionNodePO.setStartalk(constructionNodeVO.getStartalk());
		constructionNodePO.setEndtalk(constructionNodeVO.getEndtalk());
		constructionNodePO.setTimeLimit(0);
		
		constructionNodeDao.save(constructionNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionNode(ConstructionNodeVO constructionNodeVO) throws FLException {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		constructionNodePO.setPrecheck(constructionNodeVO.getPrecheck());
		constructionNodePO.setPostcheck(constructionNodeVO.getPostcheck());
		constructionNodePO.setStacheck(constructionNodeVO.getStacheck());
		constructionNodePO.setFincheck(constructionNodeVO.getFincheck());
		constructionNodePO.setStartalk(constructionNodeVO.getStartalk());
		constructionNodePO.setEndtalk(constructionNodeVO.getEndtalk());
		constructionNodePO.setTimeLimit(constructionNodeVO.getTimeLimit());
		

		constructionNodeDao.update(constructionNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionNodeForStatus(ConstructionNodeVO constructionNodeVO) {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

		constructionNodePO.setStatus(constructionNodeVO.getStatus());

		constructionNodeDao.update(constructionNodePO);
	}

}
