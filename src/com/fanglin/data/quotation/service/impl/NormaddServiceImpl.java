package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NormaddPO;
import com.fanglin.data.quotation.dao.NormaddDao;
import com.fanglin.data.quotation.service.NormaddService;
import com.fanglin.data.quotation.service.QuotationNamingRuleService;
import com.fanglin.data.quotation.vo.NormaddVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("normaddService")
@Transactional(readOnly = true)
public class NormaddServiceImpl implements NormaddService {

	@Autowired
	private NormaddDao normaddDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationNamingRuleService quotationNamingRuleService;

	@Override
	public void pageNormadd(Paging paging, List<Filter> filters, int company) {

		List<NormaddPO> normaddPOs = normaddDao.pageNormadd(paging, filters, company);
		List<NormaddVO> normaddVOs = new ArrayList<NormaddVO>();

		NormaddVO normadd;

		for (NormaddPO normaddPO : normaddPOs) {

			normadd = new NormaddVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normaddPO, normadd, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(normaddPO.getConstructionNode(), normadd.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normaddVOs.add(normadd);
		}

		paging.setData(normaddVOs);

	}

	@Override
	public List<NormaddVO> queryNormadd(NormaddVO normaddVO, DecorationVO decorationVO, int company) throws FLException {

		Long cnid = null;
		int queryCompany = company;

		if (normaddVO != null && normaddVO.getConstructionNode() != null) {
			cnid = normaddVO.getConstructionNode().getCnid();
		}

		if (decorationVO != null && decorationVO.getOrderId() != null) {
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "装修单不存在");
			}

			queryCompany = decorationPO.getCompany();
		}

		List<NormaddPO> normaddPOs = normaddDao.queryNormadd(cnid, queryCompany);
		List<NormaddVO> normaddVOs = new ArrayList<NormaddVO>();

		NormaddVO normadd;

		for (NormaddPO normaddPO : normaddPOs) {

			normadd = new NormaddVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normaddPO, normadd, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(normaddPO.getConstructionNode(), normadd.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normaddVOs.add(normadd);
		}

		return normaddVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormadd(NormaddVO normaddVO, int company) {

		if (!quotationNamingRuleService.validateNormaddName(normaddVO.getName())) {
			throw new FLException(200099, "附加费名称不在命名规则范围内");
		}

		NormaddPO normaddPO = new NormaddPO(new ConstructionNodePO());

		normaddPO.setName(normaddVO.getName());
		normaddPO.setUnit(normaddVO.getUnit());
		normaddPO.setPrice(normaddVO.getPrice());
		normaddPO.getConstructionNode().setCnid(normaddVO.getConstructionNode().getCnid());
		normaddPO.setCompany(company);

		normaddDao.save(normaddPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNormadd(NormaddVO normaddVO) {

		NormaddPO normaddPO = normaddDao.get(normaddVO.getNaid());

		if (normaddPO != null) {

			normaddPO.getConstructionNode().setCnid(normaddVO.getConstructionNode().getCnid());
			normaddPO.setUnit(normaddVO.getUnit());
			normaddPO.setPrice(normaddVO.getPrice());

			normaddDao.update(normaddPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNormaddForStatus(NormaddVO normaddVO) {

		NormaddPO normaddPO = normaddDao.get(normaddVO.getNaid());

		if (normaddPO != null) {

			normaddPO.setStatus(normaddVO.getStatus());

			normaddDao.update(normaddPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormadd(NormaddVO normaddVO) {

		NormaddPO normaddPO = normaddDao.get(normaddVO.getNaid());

		if (normaddPO != null) {

			normaddDao.delete(normaddPO);
		}

		return 0;
	}

}
