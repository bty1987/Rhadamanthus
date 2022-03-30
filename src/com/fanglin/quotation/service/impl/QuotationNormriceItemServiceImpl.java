package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.NormaddPO;
import com.fanglin.data.quotation.dao.impl.NormaddDaoImpl;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationNormriceItemDao;
import com.fanglin.quotation.po.QuotationNormriceItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationNormriceItemService;
import com.fanglin.quotation.vo.QuotationNormriceItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationNormriceItemService")
@Transactional(readOnly = true)
public class QuotationNormriceItemServiceImpl implements QuotationNormriceItemService {

	@Autowired
	private QuotationNormriceItemDao quotationNormriceItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormaddDaoImpl normaddDaoImpl;

	@Override
	public List<QuotationNormriceItemVO> queryQuotationNormrice(QuotationNormriceItemVO quotationNormriceItem) {

		List<QuotationNormriceItemPO> quotationNormriceItemPOs = quotationNormriceItemDao.queryQuotationNormrice(quotationNormriceItem.getQid());
		List<QuotationNormriceItemVO> quotationNormriceItemVOs = new ArrayList<QuotationNormriceItemVO>();

		for (QuotationNormriceItemPO quotationNormriceItemPO : quotationNormriceItemPOs) {

			quotationNormriceItem = new QuotationNormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(quotationNormriceItemPO, quotationNormriceItem, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(quotationNormriceItemPO.getConstructionNode(), quotationNormriceItem.getConstructionNode(), Arrays.asList("accessoriesType"));

			quotationNormriceItemVOs.add(quotationNormriceItem);
		}
		return quotationNormriceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationNormriceItemVO> addQuotationNormriceItem(QuotationVO quotationVO, List<QuotationNormriceItemVO> quotationNormriceItemVOs) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		for (QuotationNormriceItemVO quotationNormriceItemVO : quotationNormriceItemVOs) {

			NormaddPO normaddPO = normaddDaoImpl.get(quotationNormriceItemVO.getSid());

			if (normaddPO == null) continue;

			QuotationNormriceItemPO quotationNormriceItemPO = new QuotationNormriceItemPO();

			quotationNormriceItemPO.setQid(quotationPO.getQid());
			quotationNormriceItemPO.setSid(quotationPO.getQid());

			quotationNormriceItemPO.setType(QuotationNormriceItemPO.TYPE_OFFER_INT);
			quotationNormriceItemPO.setNormtype(QuotationNormriceItemPO.NORMTYPE_ADD_INT);
			quotationNormriceItemPO.setAtttype(QuotationNormriceItemPO.ATTTYPE_COLLECTION_INT);

			quotationNormriceItemPO.setConstructionNode(normaddPO.getConstructionNode());

			quotationNormriceItemPO.setUnit(normaddPO.getUnit());
			quotationNormriceItemPO.setTrannum(0);
			quotationNormriceItemPO.setSalary(normaddPO.getPrice());

			quotationNormriceItemDao.save(quotationNormriceItemPO);

			quotationNormriceItemVO.setConstructionNode(new ConstructionNodeVO());

			BeanUtil.copyProperties(quotationNormriceItemPO, quotationNormriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(quotationNormriceItemPO.getConstructionNode(), quotationNormriceItemVO.getConstructionNode());

		}

		return quotationNormriceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationNormriceItem(QuotationNormriceItemVO quotationNormriceItemVO) throws FLException {

		QuotationNormriceItemPO quotationNormriceItemPO = quotationNormriceItemDao.get(quotationNormriceItemVO.getQnpiid());

		if (quotationNormriceItemPO == null) {

		}

		quotationNormriceItemDao.delete(quotationNormriceItemPO);

		return 0;
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {
		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() == QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200030, "报价状态不可操作");
		}

		return quotationPO;
	}
}
