package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.CormricePO;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.quotation.dao.CormriceDao;
import com.fanglin.data.quotation.service.CormriceService;
import com.fanglin.data.quotation.vo.CormriceVO;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cormriceService")
@Transactional(readOnly = true)
public class CormriceServiceImpl implements CormriceService {

	@Autowired
	public CormriceDao cormriceDao;

	@Override
	public void pageCormrice(Paging paging, List<Filter> filters, Integer company) {

		List<CormricePO> cormricePOs = cormriceDao.pageCormrice(paging, filters, company);
		List<CormriceVO> cormriceVOs = new ArrayList<CormriceVO>();

		for (CormricePO cormricePO : cormricePOs) {

			CormriceVO cormriceVO = new CormriceVO(new QuotationCtemVO(null, null, null, null, new MeasurementUnitVO(), new WorkTypeVO()), new ConstructionNodeVO());

			BeanUtil.copyProperties(cormricePO, cormriceVO, Arrays.asList("quotationCtem", "constructionNode"));
			BeanUtil.copyProperties(cormricePO.getConstructionNode(), cormriceVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			cormricePO.getQuotationCtem().ptv(cormriceVO.getQuotationCtem());

			cormriceVOs.add(cormriceVO);
		}

		paging.setData(cormriceVOs);

	}

	@Override
	public List<CormriceVO> queryCormriceByQcid(Long qcid) {

		List<CormricePO> cormricePOs = cormriceDao.queryCormriceByQcid(qcid);
		List<CormriceVO> cormriceVOs = new ArrayList<CormriceVO>();

		for (CormricePO cormricePO : cormricePOs) {

			CormriceVO cormriceVO = new CormriceVO(new QuotationCtemVO(null, null, null, null, new MeasurementUnitVO(), new WorkTypeVO()), new ConstructionNodeVO());

			BeanUtil.copyProperties(cormricePO, cormriceVO, Arrays.asList("quotationCtem", "constructionNode"));
			BeanUtil.copyProperties(cormricePO.getConstructionNode(), cormriceVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			cormricePO.getQuotationCtem().ptv(cormriceVO.getQuotationCtem());

			cormriceVOs.add(cormriceVO);
		}

		return cormriceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCormrice(CormriceVO cormriceVO, Integer company) {

		CormricePO cormricePO = new CormricePO(new QuotationCtemPO(), new ConstructionNodePO());

		BeanUtil.copyPropertie(cormriceVO, cormricePO, Arrays.asList("quotationCtem", "constructionNode"));
		BeanUtil.copyProperties(cormriceVO.getConstructionNode(), cormricePO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

		cormricePO.setQuotationCtem(new QuotationCtemPO(cormriceVO.getQuotationCtem().getQcid()));

		cormricePO.setStatus(CormricePO.STATUS_VALID_STR);

		cormricePO.setCompany(company);

		cormriceDao.save(cormricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCormrice(CormriceVO cormriceVO) {

		cormriceDao.deleteById(cormriceVO.getCpid());

		return 0;
	}

}
