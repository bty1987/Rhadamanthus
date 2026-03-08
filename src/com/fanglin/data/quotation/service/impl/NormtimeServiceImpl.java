package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NormtimePO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.NormtimeDao;
import com.fanglin.data.quotation.service.NormtimeService;
import com.fanglin.data.quotation.vo.NormtimeVO;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("normtimeService")
@Transactional(readOnly = true)
public class NormtimeServiceImpl implements NormtimeService {

	@Autowired
	public NormtimeDao normtimeDao;

	@Override
	public void pageNormtime(Paging paging, List<Filter> filters) {

		List<NormtimePO> normtimePOs = normtimeDao.pageNormtime(paging, filters);
		List<NormtimeVO> normtimeVOs = new ArrayList<NormtimeVO>();

		for (NormtimePO normtimePO : normtimePOs) {

			NormtimeVO normtimeVO = new NormtimeVO(new ConstructionNodeVO(), new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO()));

			BeanUtil.copyProperties(normtimePO, normtimeVO, Arrays.asList("constructionNode", "quotationItem"));
			BeanUtil.copyProperties(normtimePO.getConstructionNode(), normtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normtimePO.getQuotationItem().ptv(normtimeVO.getQuotationItem());

			normtimeVOs.add(normtimeVO);
		}

		paging.setData(normtimeVOs);
	}

	@Override
	public List<NormtimeVO> queryNormtimeByQiid(Long qiid) {

		List<NormtimePO> normtimePOs = normtimeDao.queryNormtimeByQiid(qiid);
		List<NormtimeVO> normtimeVOs = new ArrayList<NormtimeVO>();

		for (NormtimePO normtimePO : normtimePOs) {

			NormtimeVO normtimeVO = new NormtimeVO(new ConstructionNodeVO(), new QuotationItemVO(null, null, null, null, null, new WorkTypeVO(), new MeasurementUnitVO(), null));

			BeanUtil.copyProperties(normtimePO, normtimeVO, Arrays.asList("constructionNode", "quotationItem"));
			BeanUtil.copyProperties(normtimePO.getConstructionNode(), normtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normtimePO.getQuotationItem().ptv(normtimeVO.getQuotationItem());

			normtimeVOs.add(normtimeVO);
		}

		return normtimeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormtime(NormtimeVO normtimeVO) {

		NormtimePO normtimePO = new NormtimePO(new QuotationItemPO(), new ConstructionNodePO());

		BeanUtil.copyPropertie(normtimeVO, normtimePO, Arrays.asList("constructionNode", "quotationItem"));
		BeanUtil.copyProperties(normtimeVO.getConstructionNode(), normtimePO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

		normtimePO.setQuotationItem(new QuotationItemPO(normtimeVO.getQuotationItem().getQiid()));

		normtimePO.setStatus(NormtimePO.STATUS_VALID_STR);

		normtimeDao.save(normtimePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormtime(NormtimeVO normtimeVO) {

		normtimeDao.deleteById(normtimeVO.getNtid());

		return 0;
	}

}
