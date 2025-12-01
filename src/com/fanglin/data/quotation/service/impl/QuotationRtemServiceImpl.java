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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationRtemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.QuotationRtemDao;
import com.fanglin.data.quotation.service.QuotationRtemService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationRtemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationRtemService")
@Transactional(readOnly = true)
public class QuotationRtemServiceImpl implements QuotationRtemService {

	@Autowired
	private QuotationRtemDao quotationRtemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Override
	public List<QuotationRtemVO> queryQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		List<QuotationRtemPO> quotationRtemPOs = quotationRtemDao.queryQuotationRtem(quotationRtemVO.getSource().getQiid());
		List<QuotationRtemVO> quotationRtemVOs = new ArrayList<QuotationRtemVO>();

		for (QuotationRtemPO quotationRtemPO : quotationRtemPOs) {

			QuotationItemVO quotationItemVO = new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO());

			quotationRtemVOs.add(quotationRtemPO.ptv(new QuotationRtemVO(quotationItemVO, quotationItemVO)));
		}

		return quotationRtemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		if (quotationRtemVO.getSource() == null) {
			throw new FLException(200013, "报价项不存在");
		}

		QuotationItemPO source = quotationItemDao.get(quotationRtemVO.getSource().getQiid());

		if (source == null) {
			throw new FLException(200013, "报价项不存在");
		}

		if (quotationRtemVO.getTarget() == null) {
			throw new FLException(200013, "报价项不存在");
		}

		QuotationItemPO target = quotationItemDao.get(quotationRtemVO.getTarget().getQiid());

		if (target == null) {
			throw new FLException(200013, "报价项不存在");
		}

		QuotationRtemPO quotationRtemPO = new QuotationRtemPO(source, target);

		BeanUtil.copyProperties(quotationRtemVO, quotationRtemPO, Arrays.asList("source", "target"));

		quotationRtemDao.save(quotationRtemPO);

		source.setIsRtem(quotationRtemDao.countQuotationRtem(source.getQiid()) > 0 ? QuotationItemPO.ISRTEM_CACSE_INT : QuotationItemPO.ISRTEM_NONE_INT);

		List<QuotationRtemPO> quotaitonRtemPOs = quotationRtemDao.queryQuotationRtem(quotationRtemVO.getSource().getQiid());

		StringBuffer rtemFlag = new StringBuffer();

		for (QuotationRtemPO quotationRtemRO : quotaitonRtemPOs) {
			rtemFlag.append(String.format("%s,", quotationRtemRO.getTarget().getQiid()));
		}

		source.setRtemFlag(rtemFlag.toString());

		quotationItemDao.update(source);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		QuotationRtemPO quotationRtemPO = quotationRtemDao.get(quotationRtemVO.getQrid());

		if (quotationRtemPO == null) return 0;

		quotationRtemDao.delete(quotationRtemPO);

		QuotationItemPO source = quotationRtemPO.getSource();

		source.setIsRtem(quotationRtemDao.countQuotationRtem(source.getQiid()) > 0 ? QuotationItemPO.ISRTEM_CACSE_INT : QuotationItemPO.ISRTEM_NONE_INT);

		quotationItemDao.update(source);

		return 0;
	}
}
