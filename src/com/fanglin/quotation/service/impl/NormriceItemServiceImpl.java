package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NormaddPO;
import com.fanglin.data.quotation.dao.impl.NormaddDaoImpl;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormriceItemService;
import com.fanglin.quotation.vo.NormriceItemVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.utils.BeanUtil;

@Service("normriceItemService")
@Transactional(readOnly = true)
public class NormriceItemServiceImpl implements NormriceItemService {

	@Autowired
	private NormriceItemDao normriceItemDao;

	@Autowired
	private NormaddDaoImpl normaddDaoImpl;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Override
	public List<NormriceItemVO> queryNormriceItem(NormriceItemVO normriceItem) {

		List<NormriceItemPO> normriceItemPOs = normriceItemDao.queryNormriceItem(normriceItem.getQid());
		List<NormriceItemVO> normriceItemVOs = new ArrayList<NormriceItemVO>();

		for (NormriceItemPO normriceItemPO : normriceItemPOs) {

			normriceItem = new NormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItem, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItem.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normriceItemVOs.add(normriceItem);
		}

		return normriceItemVOs;
	}

	@Override
	public List<NormriceItemVO> queryNormriceItemByType(NormriceItemVO normriceItem) {

		List<NormriceItemPO> normriceItemPOs = normriceItemDao.queryNormriceItemByType(normriceItem.getQid(), normriceItem.getType());
		List<NormriceItemVO> normriceItemVOs = new ArrayList<NormriceItemVO>();

		for (NormriceItemPO normriceItemPO : normriceItemPOs) {

			NormriceItemVO normriceItemVO = new NormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normriceItemVOs.add(normriceItemVO);
		}

		return normriceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormriceItem(NormtionVO normtionVO, NormriceItemVO normriceItemVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(normtionVO.getQid());

		NormriceItemPO normriceItemPO = new NormriceItemPO();

		if (normriceItemVO.getSid() != null) {

			NormaddPO normaddPO = normaddDaoImpl.get(normriceItemVO.getSid());

			normriceItemPO.setQid(quotationPO.getQid());
			normriceItemPO.setSid(quotationPO.getQid());

			normriceItemPO.setType(NormriceItemPO.TYPE_QUOTA_INT);
			normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_ADD_INT);
			normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_COLLECTION_INT);
			normriceItemPO.setNum(normriceItemVO.getNum());

			normriceItemPO.setConstructionNode(normaddPO.getConstructionNode());

			normriceItemPO.setName(normaddPO.getName());
			normriceItemPO.setUnit(normaddPO.getUnit());
			normriceItemPO.setTrannum(0);
			normriceItemPO.setSalary(normaddPO.getPrice());

			normriceItemDao.save(normriceItemPO);

			normriceItemVO.setConstructionNode(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));
		} else {

			normriceItemPO.setQid(quotationPO.getQid());

			ConstructionNodePO constructionNodePO = constructionNodeDao.get(normriceItemVO.getConstructionNode().getCnid());

			normriceItemPO.setConstructionNode(constructionNodePO);

			normriceItemPO.setName(normriceItemVO.getName());
			normriceItemPO.setNum(normriceItemVO.getNum());
			normriceItemPO.setTrannum(normriceItemVO.getTrannum());
			normriceItemPO.setSalary(normriceItemVO.getSalary());

			normriceItemPO.setType(NormriceItemPO.TYPE_QUOTA_INT);
			normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_WORKFEE_INT);
			normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_COLLECTION_INT);

			normriceItemDao.save(normriceItemPO);

			normriceItemVO.setConstructionNode(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));
		}

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, normriceItemPO.getConstructionNode().getCnid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormriceItem(NormtionVO normtionVO, NormriceItemVO normriceItemVO) throws FLException {

		NormriceItemPO normriceItemPO = normriceItemDao.get(normriceItemVO.getNpiid());

		if (normriceItemPO == null) {
			return 0;
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(normriceItemPO.getQid());

		long cnid = normriceItemPO.getConstructionNode().getCnid();

		normriceItemDao.delete(normriceItemPO);

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, cnid);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmNormriceItem(NormriceItemVO normriceItemVO) throws FLException {

		NormriceItemPO normriceItemPO = normriceItemDao.get(normriceItemVO.getNpiid());

		if (normriceItemPO == null) {
			return 0;
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(normriceItemPO.getQid());

		normriceItemDao.confirmNormriceItem(normriceItemPO.getNpiid());

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, normriceItemPO.getConstructionNode().getCnid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectNormriceItem(NormriceItemVO normriceItemVO) throws FLException {

		NormriceItemPO normriceItemPO = normriceItemDao.get(normriceItemVO.getNpiid());

		if (normriceItemPO == null) {
			return 0;
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(normriceItemPO.getQid());

		normriceItemDao.rejectNormriceItem(normriceItemPO.getNpiid());

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, normriceItemPO.getConstructionNode().getCnid());

		return 0;
	}

	/**
	 * 根据报价单和施工节点, 更新对应工程计划的附加项状态 有status=0(待确认)的附加项 → additemStatus=1(待审) 没有status=0的附加项 → additemStatus=0(无)
	 */
	private void updateConstructionScheduleForAdditemStatus(QuotationPO quotationPO, long cnid) {

		if (quotationPO == null || quotationPO.getOrderId() == null) {
			return;
		}

		ConstructionSchedulePO schedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(quotationPO.getOrderId(), cnid);

		if (schedulePO == null) {
			return;
		}

		int initCount = normriceItemDao.countNormoodItem(quotationPO.getQid(), cnid);

		schedulePO.setAdditemStatus(initCount > 0 ? ConstructionSchedulePO.ADDITEMSTATUS_PENDING_INT : ConstructionSchedulePO.ADDITEMSTATUS_NONE_INT);
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {

		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotationPO;
	}
}
