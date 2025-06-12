package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionPeriodNodeDao;
import com.fanglin.data.common.service.ConstructionPeriodNodeService;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.common.vo.ConstructionPeriodNodeVO;
import com.fanglin.data.common.vo.SurveyTemplateVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.ConstructionPeriodNodePO;
import com.fanglin.utils.BeanUtil;

@Service("constructionPeriodNodeService")
@Transactional(readOnly = true)
public class ConstructionPeriodNodeServiceImpl implements ConstructionPeriodNodeService {

	@Autowired
	private ConstructionPeriodNodeDao constructionPeriodNodeDao;

	@Override
	public List<ConstructionPeriodNodeVO> queryConstructionPeriodNodeByCpid(ConstructionPeriodNodeVO constructionPeriodNode) throws FLException {

		List<ConstructionPeriodNodePO> ConstructionPeriodNodePOs = constructionPeriodNodeDao.queryConstructionPeriodNodeByCpid(constructionPeriodNode.getCpid());
		List<ConstructionPeriodNodeVO> ConstructionPeriodNodeVOs = new ArrayList<ConstructionPeriodNodeVO>();

		for (ConstructionPeriodNodePO ConstructionPeriodNodePO : ConstructionPeriodNodePOs) {
			ConstructionPeriodNodeVOs.add(ConstructionPeriodNodePO.ptv(new ConstructionPeriodNodeVO(new ConstructionNodeVO(new SurveyTemplateVO(), new SurveyTemplateVO()))));
		}

		return ConstructionPeriodNodeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionPeriodNode(ConstructionPeriodNodeVO constructionPeriodNode) {

		ConstructionPeriodNodePO constructionPeriodNodePO = new ConstructionPeriodNodePO();

		BeanUtil.copy(constructionPeriodNode, constructionPeriodNodePO, Arrays.asList("constructionNode"));

		constructionPeriodNodePO.setConstructionNode(new ConstructionNodePO(constructionPeriodNode.getConstructionNode().getCnid()));

		constructionPeriodNodeDao.save(constructionPeriodNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConstructionPeriodNodeByCpnid(ConstructionPeriodNodeVO constructionPeriodNode) {

		constructionPeriodNodeDao.deleteById(constructionPeriodNode.getCpnid());

		return 0;
	}

}
