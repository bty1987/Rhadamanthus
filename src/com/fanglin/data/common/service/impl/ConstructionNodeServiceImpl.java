package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.fanglin.information.po.MessageQueuingPO;
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

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	public void pageConstructionNode(Paging paging, List<Filter> filters, int company) {

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.pageConstructionNode(paging, filters, company);
		List<ConstructionNodeVO> constructionNodeVOs = new ArrayList<ConstructionNodeVO>();

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
			constructionNodeVOs.add(constructionNodePO.ptv(new ConstructionNodeVO(new SurveyTemplateVO(), new SurveyTemplateVO())));
		}

		// 上级节点名称回填: 引用行(pcnid>0)按pcnid批量查集团行, 防循环单查
		List<Long> cnids = new ArrayList<Long>();

		for (ConstructionNodeVO item : constructionNodeVOs) {
			if (item.getPcnid() != null && item.getPcnid() > 0) {
				cnids.add(item.getPcnid());
			}
		}

		if (!cnids.isEmpty()) {

			Map<Long, String> parentNames = new HashMap<Long, String>();

			for (ConstructionNodePO parentPO : constructionNodeDao.queryConstructionNodeByCnids(cnids)) {
				parentNames.put(parentPO.getCnid(), parentPO.getName());
			}

			for (ConstructionNodeVO item : constructionNodeVOs) {
				if (item.getPcnid() != null && item.getPcnid() > 0) {
					item.setParentName(parentNames.get(item.getPcnid()));
				}
			}
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
	public List<ConstructionNodeVO> queryConstructionNodeForGroup(String name) {

		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNodeForGroup(name, 10);
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
			throw new FLException(140013, "装修单不存在");
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
		constructionNodePO.setTimeLimit(constructionNodeVO.getTimeLimit());
		constructionNodePO.setMark(constructionNodeVO.getMark());
		constructionNodePO.setAccount(constructionNodeVO.getAccount() == null ? ConstructionNodePO.ACCOUNT_INVALID_INT : constructionNodeVO.getAccount());
		constructionNodePO.setAccessoryLimit(constructionNodeVO.getAccessoryLimit());
		constructionNodePO.setSalaryLimit(constructionNodeVO.getSalaryLimit());
		constructionNodePO.setSalaryFloor(constructionNodeVO.getSalaryFloor() == null ? 0 : constructionNodeVO.getSalaryFloor());

		// 平台同步: 创建支持status(未传默认启用INIT)与sort(未传默认0), timeLimit取VO实值(入口已兜null)
		constructionNodePO.setStatus(constructionNodeVO.getStatus() == null ? ConstructionNodePO.STATUS_INIT_SHORT : constructionNodeVO.getStatus());
		constructionNodePO.setSort(constructionNodeVO.getSort() == null ? 0 : constructionNodeVO.getSort());

		constructionNodePO.setProcess(constructionNodeVO.getProcess());
		constructionNodePO.setProset(constructionNodeVO.getProset());

		constructionNodePO.setCompany(constructionNodeVO.getCompany() == null ? 0 : constructionNodeVO.getCompany());

		constructionNodePO.setPcnid(constructionNodeVO.getPcnid() == null ? 0 : constructionNodeVO.getPcnid());

		constructionNodeDao.save(constructionNodePO);

		constructionNodeVO.setCnid(constructionNodePO.getCnid());

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(null, "addConstructionNode", "{\"cnid\":" + constructionNodePO.getCnid() + ",\"event\":\"NODE_CREATED\"}"));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionNode(ConstructionNodeVO constructionNodeVO) throws FLException {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		// 平台同步增量语义(照PaymentDO/平台同步惯例): 全字段非null才覆盖——ERP功能维护页表单全字段传参行为不变;
		// PM同步部分传参时未传字段保持库中原值(name列NOT NULL防覆盖置空; status支持启停同步);
		// startSurvey/endSurvey段维持原全量契约(未传即清空, 保留ERP页面"清空勘察模板"操作)
		if (constructionNodeVO.getName() != null) constructionNodePO.setName(constructionNodeVO.getName());
		if (constructionNodeVO.getStatus() != null) constructionNodePO.setStatus(constructionNodeVO.getStatus());
		if (constructionNodeVO.getPrecheck() != null) constructionNodePO.setPrecheck(constructionNodeVO.getPrecheck());
		if (constructionNodeVO.getPostcheck() != null) constructionNodePO.setPostcheck(constructionNodeVO.getPostcheck());
		if (constructionNodeVO.getStacheck() != null) constructionNodePO.setStacheck(constructionNodeVO.getStacheck());
		if (constructionNodeVO.getFincheck() != null) constructionNodePO.setFincheck(constructionNodeVO.getFincheck());
		if (constructionNodeVO.getStartalk() != null) constructionNodePO.setStartalk(constructionNodeVO.getStartalk());
		if (constructionNodeVO.getEndtalk() != null) constructionNodePO.setEndtalk(constructionNodeVO.getEndtalk());
		if (constructionNodeVO.getKino() != null) constructionNodePO.setKino(constructionNodeVO.getKino());
		if (constructionNodeVO.getKiname() != null) constructionNodePO.setKiname(constructionNodeVO.getKiname());
		if (constructionNodeVO.getProcess() != null) constructionNodePO.setProcess(constructionNodeVO.getProcess());
		if (constructionNodeVO.getProset() != null) constructionNodePO.setProset(constructionNodeVO.getProset());
		if (constructionNodeVO.getTimeLimit() != null) constructionNodePO.setTimeLimit(constructionNodeVO.getTimeLimit());
		if (constructionNodeVO.getMark() != null) constructionNodePO.setMark(constructionNodeVO.getMark());
		if (constructionNodeVO.getAccount() != null) constructionNodePO.setAccount(constructionNodeVO.getAccount());
		if (constructionNodeVO.getAccessoryLimit() != null) constructionNodePO.setAccessoryLimit(constructionNodeVO.getAccessoryLimit());
		if (constructionNodeVO.getSalaryLimit() != null) constructionNodePO.setSalaryLimit(constructionNodeVO.getSalaryLimit());
		if (constructionNodeVO.getSalaryFloor() != null) constructionNodePO.setSalaryFloor(constructionNodeVO.getSalaryFloor());

		constructionNodePO.setStartSurvey(null);
		constructionNodePO.setEndSurvey(null);

		if (constructionNodeVO.getStartSurvey() != null && constructionNodeVO.getStartSurvey().getStid() != null) {
			constructionNodePO.setStartSurvey(surveyTemplateDao.get(constructionNodeVO.getStartSurvey().getStid()));
		}

		if (constructionNodeVO.getEndSurvey() != null && constructionNodeVO.getEndSurvey().getStid() != null) {
			constructionNodePO.setEndSurvey(surveyTemplateDao.get(constructionNodeVO.getEndSurvey().getStid()));
		}

		constructionNodeDao.update(constructionNodePO);

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(null, "updateConstructionNode", "{\"cnid\":" + constructionNodeVO.getCnid() + ",\"event\":\"NODE_UPDATED\"}"));
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

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(null, "updateConstructionNodeForStatus", "{\"cnid\":" + constructionNodeVO.getCnid() + ",\"status\":" + constructionNodeVO.getStatus() + ",\"event\":\"NODE_UPDATED\"}"));
	}

}
