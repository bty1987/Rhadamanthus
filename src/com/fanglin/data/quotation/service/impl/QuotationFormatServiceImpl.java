package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.data.quotation.dao.QuotationCtemDao;
import com.fanglin.data.quotation.dao.QuotationFormatDao;
import com.fanglin.data.quotation.service.QuotationFormatService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationFormatVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("quotationFormatService")
@Transactional(readOnly = true)
public class QuotationFormatServiceImpl implements QuotationFormatService {

	@Autowired
	public QuotationFormatDao quotationFormatDao;

	@Autowired
	public QuotationCtemDao quotationCtemDao;

	@Override
	public List<QuotationFormatVO> queryQuotationFormat(QuotationFormatVO quotationFormatVO) {

		Paging paging = new Paging(0, 10);

		List<QuotationFormatPO> quotationFormatPOs = quotationFormatDao.queryQuotationFormat(paging, quotationFormatVO.getPinyin());
		List<QuotationFormatVO> quotationFormatVOs = new ArrayList<QuotationFormatVO>();

		for (QuotationFormatPO quotationFormatPO : quotationFormatPOs) {

			quotationFormatVOs.add(quotationFormatPO.ptv(new QuotationFormatVO(new QuotationCtemVO(), new MeasurementUnitVO())));
		}

		return quotationFormatVOs;
	}

	@Override
	public List<QuotationFormatVO> queryQuotationFormatByQcid(Long qcid, List<Filter> filters) {

		List<QuotationFormatPO> quotationFormatPOs = quotationFormatDao.queryQuotationFormatByQcid(qcid, filters);
		List<QuotationFormatVO> quotationFormatVOs = new ArrayList<QuotationFormatVO>();

		for (QuotationFormatPO quotationFormatPO : quotationFormatPOs) {

			quotationFormatVOs.add(quotationFormatPO.ptv(new QuotationFormatVO(new QuotationCtemVO(), new MeasurementUnitVO())));
		}

		return quotationFormatVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationFormat(QuotationFormatVO quotationFormatVO) throws FLException {

		QuotationFormatPO quotationFormatPO = new QuotationFormatPO();

		BeanUtil.copyPropertie(quotationFormatVO, quotationFormatPO, Arrays.asList("quotationCtem", "unit", "workType"));

		QuotationCtemPO quotationCtemPO = quotationCtemDao.get(quotationFormatVO.getQuotationCtem().getQcid());

		if (quotationCtemPO == null) {
			throw new FLException(200077, "报价项目不存在");
		}

		// 同项目下规格唯一(含空串, 一项目仅一条空规格)
		if (!quotationFormatDao.queryQuotationFormatByQcidAndFormat(quotationCtemPO.getQcid(), quotationFormatVO.getFormat()).isEmpty()) {
			throw new FLException(200079, "报价规格已存在");
		}

		quotationFormatPO.setQuotationCtem(quotationCtemPO);

		// 名称随项目: 表单不再采集, 取所属项目名(规格可为空串)
		quotationFormatPO.setName(quotationCtemPO.getName());

		quotationFormatPO.setMeasurementUnit(quotationFormatVO.getUnit() == null || quotationFormatVO.getUnit().getId() == 0 ? null : new MeasurementUnitPO(quotationFormatVO.getUnit().getId()));

		quotationFormatPO.setWorkType(quotationFormatVO.getWorkType() == null || quotationFormatVO.getWorkType().getId() == 0 ? null : new WorkTypePO(quotationFormatVO.getWorkType().getId()));

		quotationFormatPO.setStatus(QuotationFormatPO.STATUS_ENABLE_STR);

		quotationFormatPO.setPinyin(PinYin4Util.getPinYinHeadChar(quotationFormatPO.getName() + quotationFormatVO.getFormat()).get(0));

		quotationFormatDao.save(quotationFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFormat(QuotationFormatVO quotationFormatVO) throws FLException {

		QuotationFormatPO quotationFormatPO = quotationFormatDao.get(quotationFormatVO.getQfid());

		// 同项目下规格唯一, 排除自身
		for (QuotationFormatPO sameFormat : quotationFormatDao.queryQuotationFormatByQcidAndFormat(quotationFormatPO.getQuotationCtem().getQcid(), quotationFormatVO.getFormat())) {

			if (sameFormat.getQfid() != quotationFormatVO.getQfid()) {
				throw new FLException(200079, "报价规格已存在");
			}
		}

		BeanUtil.copyProperties(quotationFormatVO, quotationFormatPO, Arrays.asList("quotationCtem", "unit", "workType"));

		quotationFormatPO.setMeasurementUnit(quotationFormatVO.getUnit() == null || quotationFormatVO.getUnit().getId() == 0 ? null : new MeasurementUnitPO(quotationFormatVO.getUnit().getId()));

		quotationFormatPO.setWorkType(quotationFormatVO.getWorkType() == null || quotationFormatVO.getWorkType().getId() == 0 ? null : new WorkTypePO(quotationFormatVO.getWorkType().getId()));

		// 名称不随表单更新(表单已不采集), 拼音按库中名称+新规格重算
		quotationFormatPO.setPinyin(PinYin4Util.getPinYinHeadChar(quotationFormatPO.getName() + quotationFormatVO.getFormat()).get(0));

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
