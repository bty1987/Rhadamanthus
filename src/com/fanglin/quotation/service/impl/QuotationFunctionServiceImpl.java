package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationFunctionDao;
import com.fanglin.quotation.po.QuotationFunctionPO;
import com.fanglin.quotation.service.QuotationFunctionService;
import com.fanglin.quotation.vo.QuotationFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationFunctionService")
@Transactional(readOnly = true)
public class QuotationFunctionServiceImpl implements QuotationFunctionService {

	@Autowired
	private QuotationFunctionDao quotationFunctionDao;

	@Override
	public List<QuotationFunctionVO> queryQuotationFunction(QuotationFunctionVO quotationFunctionVO) {

		List<QuotationFunctionPO> quotationFunctionPOs = quotationFunctionDao.queryQuotationFunction(quotationFunctionVO.getType());
		List<QuotationFunctionVO> quotationFunctionVOs = new ArrayList<QuotationFunctionVO>();

		for (QuotationFunctionPO quotationFunctionPO : quotationFunctionPOs) {

			quotationFunctionVO = new QuotationFunctionVO();
			BeanUtil.copyPropertie(quotationFunctionPO, quotationFunctionVO);

			quotationFunctionVOs.add(quotationFunctionVO);

		}

		return quotationFunctionVOs;
	}

	@Override
	public List<QuotationFunctionVO> pageQuotationFunction(Paging paging, List<Filter> filters) {

		List<QuotationFunctionPO> quotationFunctionPOs = quotationFunctionDao.pageQuotationFunction(paging, filters);
		List<QuotationFunctionVO> quotationFunctionVOs = new ArrayList<QuotationFunctionVO>();

		for (QuotationFunctionPO quotationFunctionPO : quotationFunctionPOs) {

			QuotationFunctionVO quotationFunctionVO = new QuotationFunctionVO();
			BeanUtil.copyPropertie(quotationFunctionPO, quotationFunctionVO);

			quotationFunctionVOs.add(quotationFunctionVO);
		}

		return quotationFunctionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationFunction(QuotationFunctionVO quotationFunctionVO) throws FLException {

		if (quotationFunctionDao.queryQuotationFunctionByName(quotationFunctionVO.getName()).size() > 0) {
			throw new FLException(200127, "报价功能已存在");
		}

		QuotationFunctionPO quotationFunctionPO = new QuotationFunctionPO();

		BeanUtil.copyPropertie(quotationFunctionVO, quotationFunctionPO);

		quotationFunctionDao.save(quotationFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunction(QuotationFunctionVO quotationFunctionVO) throws FLException {

		QuotationFunctionPO quotationFunctionPO = quotationFunctionDao.get(quotationFunctionVO.getQfid());

		if (quotationFunctionPO == null) {
			throw new FLException(200129, "报价功能不存在");
		}

		for (QuotationFunctionPO namePO : quotationFunctionDao.queryQuotationFunctionByName(quotationFunctionVO.getName())) {
			if (namePO.getQfid() != quotationFunctionVO.getQfid().longValue()) {
				throw new FLException(200127, "报价功能已存在");
			}
		}

		BeanUtil.copyPropertie(quotationFunctionVO, quotationFunctionPO, Arrays.asList("qfid"));

		quotationFunctionDao.update(quotationFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationFunction(QuotationFunctionVO quotationFunctionVO) throws FLException {

		if (quotationFunctionDao.countQuotationFunctionRightByQfid(quotationFunctionVO.getQfid()) > 0) {
			throw new FLException(200128, "报价功能已被引用,不可删除");
		}

		quotationFunctionDao.deleteById(quotationFunctionVO.getQfid());

		return 0;
	}

}
