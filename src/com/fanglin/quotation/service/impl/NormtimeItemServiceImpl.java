package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.quotation.dao.NormtimeItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormtimeItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormtimeItemService;
import com.fanglin.quotation.vo.NormtimeItemVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.utils.BeanUtil;

@Service("normtimeItemService")
@Transactional(readOnly = true)
public class NormtimeItemServiceImpl implements NormtimeItemService {

	@Autowired
	private NormtimeItemDao normtimeItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public List<NormtimeItemVO> queryNormtimeItem(NormtimeItemVO normtimeItem) {

		List<NormtimeItemPO> normtimeItemPOs = normtimeItemDao.queryNormtimeItem(normtimeItem.getQid());
		List<NormtimeItemVO> normtimeItemVOs = new ArrayList<NormtimeItemVO>();

		for (NormtimeItemPO normtimeItemPO : normtimeItemPOs) {

			normtimeItem = new NormtimeItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normtimeItemPO, normtimeItem, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normtimeItemPO.getConstructionNode(), normtimeItem.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normtimeItemVOs.add(normtimeItem);
		}

		return normtimeItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormtimeItem(NormtionVO normtionVO, NormtimeItemVO normtimeItemVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(normtionVO.getQid());

		NormtimeItemPO normtimeItemPO = new NormtimeItemPO();

		normtimeItemPO.setQid(quotationPO.getQid());

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(normtimeItemVO.getConstructionNode().getCnid());

		normtimeItemPO.setConstructionNode(constructionNodePO);

		normtimeItemPO.setName(normtimeItemVO.getName());
		normtimeItemPO.setNum(normtimeItemVO.getNum());
		normtimeItemPO.setTrannum(normtimeItemVO.getTrannum());
		normtimeItemPO.setWorkdays(normtimeItemVO.getWorkdays());

		normtimeItemPO.setType(NormtimeItemPO.TYPE_QUOTA_INT);
		normtimeItemPO.setNormtype(NormtimeItemPO.NORMTYPE_WORKDAYS_INT);
		normtimeItemPO.setAtttype(NormtimeItemPO.ATTTYPE_COLLECTION_INT);

		normtimeItemDao.save(normtimeItemPO);

		normtimeItemVO.setConstructionNode(new ConstructionNodeVO());

		BeanUtil.copyProperties(normtimeItemPO, normtimeItemVO, Arrays.asList("constructionNode"));
		BeanUtil.copyPropertie(normtimeItemPO.getConstructionNode(), normtimeItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormtimeItem(NormtionVO normtionVO, NormtimeItemVO normtimeItemVO) throws FLException {

		NormtimeItemPO normtimeItemPO = normtimeItemDao.get(normtimeItemVO.getNtiid());

		if (normtimeItemPO == null) {
			return 0;
		}

		checkQuotationForStatusByEnabled(normtimeItemPO.getQid());

		normtimeItemDao.delete(normtimeItemPO);

		return 0;
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {

		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotationPO;
	}
}
