/**
 * @File Name		: QuotationFunctionAreaItemServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionAreaItemService")
@Transactional(readOnly = true)
public class QuotationFunctionAreaItemServiceImpl implements QuotationFunctionAreaItemService {

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Override
	public List<QuotationFunctionAreaItemVO> queryQuotationFunctionAreaItemByQuotationFunctionAreaId(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());
		
		List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();

		for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {

			quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();

			BeanUtil.copyProperties(quotationFunctionAreaItemPO, quotationFunctionAreaItemVO);

			if (quotationFunctionAreaItemPO.getQuotationItem() != null) {

				QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();
				
				quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiId());
				quotationFunctionAreaItemVO.setContent(quotationItemPO.getQuotationItemDes());
				quotationFunctionAreaItemVO.setAddPrice(quotationItemPO.getAddPrice());
				quotationFunctionAreaItemVO.setSubPrice(quotationItemPO.getSubPrice());
			}

			quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
		}

		return quotationFunctionAreaItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationFunctionAreaItemVO updateQuotationFunctionAreaItem(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO, QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		Long qfaiId = quotationFunctionAreaItemVO.getQfaiId();
	
		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		if (qfaiId != null) {

			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), qfaiId);

			if (quotationFunctionAreaItemPO == null) {
				throw new FLException(200013, "报价项不存在");
			}
			
			if (quotationFunctionAreaItemPO.getQuotationItem() != null) {
				
				if (selectionItemDao.countSelectionItem(quotationPO.getOrderId(), quotationFunctionAreaItemPO.getQuotationFunctionArea().getQfaId()) > 0) {
					throw new FLException(200037, "存在关联选材项");
				}
			}

			quotationFunctionAreaItemPO.setFormula(quotationFunctionAreaItemVO.getFormula());
			quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
			quotationFunctionAreaItemPO.setInitNum(quotationFunctionAreaItemVO.getInitNum());

			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		} else {

			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = QuotationFunctionAreaItemPO.factoryToInstance(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

			BeanUtil.copyProperties(quotationFunctionAreaItemVO, quotationFunctionAreaItemPO);

			quotationFunctionAreaItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(quotationFunctionAreaItemVO.getQuotationFunctionAreaId()));

			if (quotationFunctionAreaItemVO.getType() == 0 || quotationFunctionAreaItemVO.getType() == 5 || quotationFunctionAreaItemVO.getType() == 4) {
				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(quotationFunctionAreaItemVO.getQuotationItemId()));
				quotationFunctionAreaItemPO.setContent(null);
			} else {
				quotationFunctionAreaItemPO.setContent(quotationFunctionAreaItemVO.getContent());
				quotationFunctionAreaItemPO.setQuotationItem(null);
			}

			quotationFunctionAreaItemDao.save(quotationFunctionAreaItemPO);

			quotationFunctionAreaItemVO.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());
		}

		quotationDao.update(quotationPO);

		return quotationFunctionAreaItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemForSpec(QuotationVO quotationVO, QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		List<Short> types = Arrays.asList(QuotationFunctionAreaItemPO.TYPE_QUOTATION_COMMON_SHORT, QuotationFunctionAreaItemPO.TYPE_QUOTATION_CUSTOMER_SHORT, QuotationFunctionAreaItemPO.TYPE_QUOTATION_FIX_SHORT);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		checkQuotationForStatusByEnabled(null, quotationFunctionAreaPO.getQuotation());
		
		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaItemVO.getQfaiId());

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		short type = quotationFunctionAreaItemPO.getType();

		if (!types.contains(type)) {

			quotationFunctionAreaItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());

			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemByQuotationIdAType(QuotationVO quotationVO, QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {

		List<Short> types = Arrays.asList(QuotationFunctionAreaItemPO.TYPE_QUOTATION_COMMON_SHORT, QuotationFunctionAreaItemPO.TYPE_QUOTATION_CUSTOMER_SHORT, QuotationFunctionAreaItemPO.TYPE_QUOTATION_FIX_SHORT);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.queryQuotationFunctionAreaForTypeByQuotationId(quotationVO.getQid(), QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT);

		checkQuotationForStatusByEnabled(null, quotationFunctionAreaPO.getQuotation());
		
		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaItemVO.getType());

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		short type = quotationFunctionAreaItemPO.getType();

		if (!types.contains(type)) {
			quotationFunctionAreaItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());

			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemForIndex(List<QuotationFunctionAreaItemVO> QuotationFunctionAreaItemVOs, QuotationFunctionAreaVO quotationFunctionAreaVO) throws FLException {
	
		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());
		
		String table = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

		for (QuotationFunctionAreaItemVO quotationFunctionAreaItemVO : QuotationFunctionAreaItemVOs) {
			quotationFunctionAreaItemDao.updateQuotationFunctionAreaItemForIndex(table, quotationFunctionAreaItemVO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationFunctionAreaItem(List<Long> qfaiIds, QuotationVO quotationVO, QuotationFunctionAreaVO quotationFunctionAreaVO) throws FLException {
	
		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());

		if (quotationFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		if (selectionItemDao.countSelectionItem(quotationPO.getOrderId(), quotationFunctionAreaPO.getQfaId()) > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		if (qfaiIds != null && qfaiIds.size() > 0) {

			QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
	
			String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByQfaiIds(tableName, qfaiIds);
		}

		quotationDao.update(quotationPO);

		return 0;
	}

	private QuotationPO checkQuotationForStatusByEnabled(Long qid, QuotationPO quotationPO) throws FLException {

		if (quotationPO == null) {
			quotationPO = quotationDao.get(qid);
		}

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() == QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200030, "报价状态不可操作");
		}

		return quotationPO;
	}
}
