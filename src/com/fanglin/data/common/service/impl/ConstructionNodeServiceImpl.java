package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.common.service.ConstructionNodeService;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.common.vo.SurveyTemplateVO;
import com.fanglin.data.po.ConstructionNodePO;
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

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Override
	public void pageConstructionNode(Paging paging, List<Filter> filters, int company) {

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.pageConstructionNode(paging, filters, company);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			constructionNodeVOs.add(constructionNodePO.ptv(new ConstructionNodeVO(new SurveyTemplateVO(), new SurveyTemplateVO())));
		}

		paging.setData(constructionNodeVOs);
	}

	@Override
	public List<ConstructionNodeVO> queryConstructionNode(int company) {

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNode(company);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			constructionNodeVOs.add(constructionNodePO.ptv(new ConstructionNodeVO(new SurveyTemplateVO(), new SurveyTemplateVO())));
		}

		return constructionNodeVOs;
	}

	@Override
	public ConstructionNodeVO queryConstructionNodeByCnid(ConstructionNodeVO constructionNodeVO) {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

		if (constructionNodePO != null) {
			constructionNodeVO = constructionNodePO.ptv(new ConstructionNodeVO(new SurveyTemplateVO(), new SurveyTemplateVO()));
		}

		return constructionNodeVO;
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

			BeanUtil.copyProperties(constructionNodePO, constructionNodeVO, Arrays.asList("startSurvey", "endSurvey"));

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
		constructionNodePO.setKino(constructionNodeVO.getKino());
		constructionNodePO.setKiname(constructionNodeVO.getKiname());
		constructionNodePO.setTimeLimit(0);
		constructionNodePO.setMark(constructionNodeVO.getMark());
		constructionNodePO.setAccessoryLimit(constructionNodeVO.getAccessoryLimit());
		constructionNodePO.setSalaryLimit(constructionNodeVO.getSalaryLimit());

		constructionNodePO.setProcess(constructionNodeVO.getProcess());
		constructionNodePO.setProset(constructionNodeVO.getProset());

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

		constructionNodePO.setKino(constructionNodeVO.getKino());
		constructionNodePO.setKiname(constructionNodeVO.getKiname());

		constructionNodePO.setProcess(constructionNodeVO.getProcess());
		constructionNodePO.setProset(constructionNodeVO.getProset());

		constructionNodePO.setTimeLimit(constructionNodeVO.getTimeLimit());
		constructionNodePO.setMark(constructionNodeVO.getMark());

		constructionNodePO.setStartSurvey(null);
		constructionNodePO.setEndSurvey(null);

		if (constructionNodeVO.getStartSurvey() != null && constructionNodeVO.getStartSurvey().getStid() != null) {
			constructionNodePO.setStartSurvey(surveyTemplateDao.get(constructionNodeVO.getStartSurvey().getStid()));
		}

		if (constructionNodeVO.getEndSurvey() != null && constructionNodeVO.getEndSurvey().getStid() != null) {
			constructionNodePO.setEndSurvey(surveyTemplateDao.get(constructionNodeVO.getEndSurvey().getStid()));
		}

		constructionNodePO.setAccessoryLimit(constructionNodeVO.getAccessoryLimit());
		constructionNodePO.setSalaryLimit(constructionNodeVO.getSalaryLimit());

		constructionNodeDao.update(constructionNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionNodeForStatus(ConstructionNodeVO constructionNodeVO) throws FLException {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		constructionNodePO.setStatus(constructionNodeVO.getStatus());

		constructionNodeDao.update(constructionNodePO);
	}

}
