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
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormriceItemService;
import com.fanglin.quotation.vo.NormriceItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("normriceItemService")
@Transactional(readOnly = true)
public class NormriceItemServiceImpl implements NormriceItemService {

	@Autowired
	private NormriceItemDao normriceItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormaddDaoImpl normaddDaoImpl;

	@Override
	public List<NormriceItemVO> queryNormriceItem(NormriceItemVO normriceItem) {

		List<NormriceItemPO> normriceItemPOs = normriceItemDao.queryNormriceItem(normriceItem.getQid());
		List<NormriceItemVO> normriceItemVOs = new ArrayList<NormriceItemVO>();

		for (NormriceItemPO normriceItemPO : normriceItemPOs) {

			normriceItem = new NormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItem, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItem.getConstructionNode(), Arrays.asList("accessoriesType"));

			normriceItemVOs.add(normriceItem);
		}

		return normriceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormriceItem(QuotationVO quotationVO, NormriceItemVO normriceItemVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		NormaddPO normaddPO = normaddDaoImpl.get(normriceItemVO.getSid());

		NormriceItemPO normriceItemPO = new NormriceItemPO();

		normriceItemPO.setQid(quotationPO.getQid());
		normriceItemPO.setSid(quotationPO.getQid());

		normriceItemPO.setType(NormriceItemPO.TYPE_OFFER_INT);
		normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_ADD_INT);
		normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_COLLECTION_INT);
		normriceItemPO.setNum(normriceItemVO.getNum());

		normriceItemPO.setConstructionNode(normaddPO.getConstructionNode());

		normriceItemPO.setName(normaddPO.getName());
		normriceItemPO.setUnit(normaddPO.getUnit());
		normriceItemPO.setTrannum(0);
		normriceItemPO.setSalary(normaddPO.getPrice());

		normriceItemDao.save(normriceItemPO);

		normriceItemVO.setConstructionNode(new ConstructionNodeVO());

		BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
		BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormriceItem(NormriceItemVO normriceItemVO) throws FLException {

		NormriceItemPO normriceItemPO = normriceItemDao.get(normriceItemVO.getNpiid());

		if (normriceItemPO == null) {

		}

		normriceItemDao.delete(normriceItemPO);

		return 0;
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {

		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotationPO;
	}
}
