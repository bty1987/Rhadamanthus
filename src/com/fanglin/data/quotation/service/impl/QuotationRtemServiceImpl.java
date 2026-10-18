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
	public List<QuotationRtemVO> queryQuotationRtemByQuotationId(long quotationId) throws FLException {

		List<QuotationRtemPO> quotationRtemPOs = quotationRtemDao.queryQuotationRtemByQuotationId(quotationId);

		return ptvList(quotationRtemPOs);
	}

	// 分区实例项VO装配(source/target关联项随行带出)
	private List<QuotationRtemVO> ptvList(List<QuotationRtemPO> quotationRtemPOs) {

		List<QuotationRtemVO> quotationRtemVOs = new ArrayList<QuotationRtemVO>();

		for (QuotationRtemPO quotationRtemPO : quotationRtemPOs) {

			QuotationItemVO quotationItemVO = new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO());

			quotationRtemVOs.add(quotationRtemPO.ptv(new QuotationRtemVO(quotationItemVO, quotationItemVO)));
		}

		return quotationRtemVOs;
	}

	@Override
	public List<QuotationRtemVO> queryQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {
		return ptvList(quotationRtemDao.queryQuotationRtem(quotationRtemVO.getSource().getQiid()));
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

		// 闸: 引用去重(库层唯一约束兜底见SQL)
		if (quotationRtemDao.countQuotationRtem(source.getQiid(), target.getQiid()) > 0) {
			throw new FLException(200130, "引用关系已存在");
		}

		// 闸: 环检测(自引用即单环)
		checkCycle(source.getQiid(), target.getQiid());

		QuotationRtemPO quotationRtemPO = new QuotationRtemPO(source, target);

		BeanUtil.copyProperties(quotationRtemVO, quotationRtemPO, Arrays.asList("source", "target"));

		quotationRtemDao.save(quotationRtemPO);

		refreshRtemState(source);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		QuotationRtemPO quotationRtemPO = quotationRtemDao.get(quotationRtemVO.getQrid());

		if (quotationRtemPO == null) return 0;

		quotationRtemDao.delete(quotationRtemPO);

		// 引用状态由真值行派生重建(add/delete对称维护, 勿在调用方散写)
		refreshRtemState(quotationRtemPO.getSource());

		return 0;
	}

	// 引用状态重建: isrtem/rtemFlag 一律由 quotationrtem 真值行派生, 勿在调用方散写
	private void refreshRtemState(QuotationItemPO source) {

		List<QuotationRtemPO> quotationRtemPOs = quotationRtemDao.queryQuotationRtem(source.getQiid());

		StringBuffer rtemFlag = new StringBuffer();

		for (QuotationRtemPO quotationRtemRO : quotationRtemPOs) {
			rtemFlag.append(String.format("%s,", quotationRtemRO.getTarget().getQiid()));
		}

		source.setIsRtem(quotationRtemPOs.isEmpty() ? QuotationItemPO.ISRTEM_NONE_INT : QuotationItemPO.ISRTEM_CACSE_INT);
		source.setRtemFlag(rtemFlag.toString());

		quotationItemDao.update(source);
	}

	// 环检测: 沿引用链从target出发, 回到source即成环(自引用同为单环)
	private void checkCycle(long sourceQiid, long targetQiid) throws FLException {

		List<Long> chain = new ArrayList<Long>();
		chain.add(targetQiid);

		int cursor = 0;

		while (cursor < chain.size() && chain.size() < 64) {

			long current = chain.get(cursor);
			cursor++;

			if (current == sourceQiid) {
				throw new FLException(200131, "引用关系成环");
			}

			for (QuotationRtemPO quotationRtemPO : quotationRtemDao.queryQuotationRtem(current)) {
				Long next = quotationRtemPO.getTarget().getQiid();
				if (!chain.contains(next)) chain.add(next);
			}
		}
	}
}
