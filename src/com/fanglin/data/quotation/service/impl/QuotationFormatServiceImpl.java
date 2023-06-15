package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.data.quotation.dao.QuotationFormatDao;
import com.fanglin.data.quotation.service.QuotationFormatService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationFormatVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.PinYin4Util;

@Service("quotationFormatService")
@Transactional(readOnly = true)
public class QuotationFormatServiceImpl implements QuotationFormatService {

	@Autowired
	public QuotationFormatDao quotationFormatDao;

	@Override
	public List<QuotationFormatVO> queryQuotationFormatByQcid(Long qcid) {

		List<QuotationFormatPO> quotationFormatPOs = quotationFormatDao.queryQuotationFormatByQcid(qcid);
		List<QuotationFormatVO> quotationFormatVOs = new ArrayList<QuotationFormatVO>();

		for (QuotationFormatPO quotationFormatPO : quotationFormatPOs) {

			QuotationFormatVO quotationFormatVO = new QuotationFormatVO(new QuotationCtemVO());

			BeanUtil.copyProperties(quotationFormatPO, quotationFormatVO, Arrays.asList("quotationCtem"));

			quotationFormatPO.getQuotationCtem().ptv(quotationFormatVO.getQuotationCtem());

			quotationFormatVOs.add(quotationFormatVO);
		}

		return quotationFormatVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationFormat(QuotationFormatVO quotationFormatVO) throws FLException {

		QuotationFormatPO quotationFormatPO = new QuotationFormatPO(new QuotationCtemPO());

		BeanUtil.copyPropertie(quotationFormatVO, quotationFormatPO, Arrays.asList("quotationCtem"));

		quotationFormatPO.setQuotationCtem(new QuotationCtemPO(quotationFormatVO.getQuotationCtem().getQcid()));

		quotationFormatPO.setStatus(QuotationFormatPO.STATUS_ENABLE_STR);

		quotationFormatPO.setPinyin(PinYin4Util.getPinYinHeadChar(quotationFormatVO.getName() + quotationFormatVO.getFormat()).get(0));

		quotationFormatDao.save(quotationFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFormat(QuotationFormatVO quotationFormatVO) throws FLException {

		QuotationFormatPO quotationFormatPO = quotationFormatDao.get(quotationFormatVO.getQfid());

		BeanUtil.copyProperties(quotationFormatVO, quotationFormatPO);

		quotationFormatPO.setPinyin(PinYin4Util.getPinYinHeadChar(quotationFormatVO.getName() + quotationFormatVO.getFormat()).get(0));

		quotationFormatDao.update(quotationFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFormatForStatus(QuotationFormatVO quotationFormatVO) throws FLException {

		QuotationFormatPO quotationFormatPO = quotationFormatDao.get(quotationFormatVO.getQfid());

		quotationFormatPO.setStatus(quotationFormatVO.getStatus());

		quotationFormatDao.update(quotationFormatPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationFormat(QuotationFormatVO quotationFormatVO) {

		QuotationFormatPO quotationFormatPO = quotationFormatDao.get(quotationFormatVO.getQfid());

		quotationFormatDao.delete(quotationFormatPO);

		return 0;
	}

}
