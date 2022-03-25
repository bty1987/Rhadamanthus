package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormpackItemPO;
import com.fanglin.data.quotation.dao.impl.NormpackItemDaoImpl;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationNormoodItemDao;
import com.fanglin.quotation.po.QuotationNormoodItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationNormoodItemService;
import com.fanglin.quotation.vo.QuotationNormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationNormoodItemService")
@Transactional(readOnly = true)
public class QuotationNormoodItemServiceImpl implements QuotationNormoodItemService {

	@Autowired
	private QuotationNormoodItemDao quotationNormoodItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormpackItemDaoImpl normpackItemDaoImpl;

	@Override
	public List<QuotationNormoodItemVO> queryQuotationNormoodItem(QuotationNormoodItemVO quotationNormoodItem) {

		List<QuotationNormoodItemPO> quotationNormoodItemPOs = quotationNormoodItemDao.queryQuotationNormoodItem(quotationNormoodItem.getQid());
		List<QuotationNormoodItemVO> quotationNormoodItemVOs = new ArrayList<QuotationNormoodItemVO>();

		for (QuotationNormoodItemPO quotationNormoodItemPO : quotationNormoodItemPOs) {

			quotationNormoodItem = new QuotationNormoodItemVO(new GoodsVO());

			BeanUtil.copyProperties(quotationNormoodItemPO, quotationNormoodItem, Arrays.asList("goods"));
			BeanUtil.copyPropertie(quotationNormoodItemPO.getGoods(), quotationNormoodItem.getGoods(), Arrays.asList("accessoriesType"));

			quotationNormoodItemVOs.add(quotationNormoodItem);
		}

		return quotationNormoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationNormoodItemVO> addQuotationNormoodItem(QuotationVO quotationVO, List<QuotationNormoodItemVO> quotationNormoodItemVOs) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		List<NormpackItemPO> normpackItems = new ArrayList<NormpackItemPO>();

		for (QuotationNormoodItemVO quotationNormoodItemVO : quotationNormoodItemVOs) {

			List<NormpackItemPO> normpackItemPOs = normpackItemDaoImpl.queryNormpackItem(quotationNormoodItemVO.getSid());

			normpackItems.addAll(normpackItemPOs);
		}

		quotationNormoodItemVOs = new ArrayList<QuotationNormoodItemVO>();

		for (NormpackItemPO normpackItemPO : normpackItems) {

			QuotationNormoodItemPO quotationNormoodItemPO = new QuotationNormoodItemPO();

			quotationNormoodItemPO.setQid(quotationPO.getQid());
			quotationNormoodItemPO.setSid(quotationPO.getQid());

			quotationNormoodItemPO.setType(QuotationNormoodItemPO.TYPE_OFFER_INT);
			quotationNormoodItemPO.setNormtype(QuotationNormoodItemPO.NORMTYPE_PACK_INT);
			quotationNormoodItemPO.setAtttype(QuotationNormoodItemPO.ATTTYPE_COLLECTION_INT);

			quotationNormoodItemPO.setGoods(new GoodsPO(normpackItemPO.getGoods().getGid()));

			quotationNormoodItemPO.setNormunit(normpackItemPO.getNormunit());
			quotationNormoodItemPO.setNormnum(normpackItemPO.getNormnum());
			quotationNormoodItemPO.setStoreunit(normpackItemPO.getStoreunit());
			quotationNormoodItemPO.setStorenum(normpackItemPO.getStorenum());
			quotationNormoodItemPO.setGoods(normpackItemPO.getGoods());

			quotationNormoodItemDao.save(quotationNormoodItemPO);

			QuotationNormoodItemVO quotationNormoodItemVO = new QuotationNormoodItemVO(new GoodsVO());

			BeanUtil.copyProperties(quotationNormoodItemPO, quotationNormoodItemVO, Arrays.asList("goods"));
			BeanUtil.copyPropertie(quotationNormoodItemPO.getGoods(), quotationNormoodItemVO.getGoods(), Arrays.asList("accessoriesType"));

			quotationNormoodItemVOs.add(quotationNormoodItemVO);
		}

		return quotationNormoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationNormoodItem(QuotationNormoodItemVO quotationNormoodItemVO) throws FLException {

		QuotationNormoodItemPO quotationNormoodItemPO = quotationNormoodItemDao.get(quotationNormoodItemVO.getQngiid());

		if (quotationNormoodItemPO == null) {

		}

		quotationNormoodItemDao.delete(quotationNormoodItemPO);

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
