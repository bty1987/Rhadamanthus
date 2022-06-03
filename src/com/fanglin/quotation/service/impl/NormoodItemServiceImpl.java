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
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormoodItemService;
import com.fanglin.quotation.vo.NormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("normoodItemService")
@Transactional(readOnly = true)
public class NormoodItemServiceImpl implements NormoodItemService {

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormpackItemDaoImpl normpackItemDaoImpl;

	@Override
	public List<NormoodItemVO> queryNormoodItem(NormoodItemVO normoodItem) {

		List<NormoodItemPO> normoodItemPOs = normoodItemDao.queryNormoodItem(normoodItem.getQid());
		List<NormoodItemVO> normoodItemVOs = new ArrayList<NormoodItemVO>();

		for (NormoodItemPO normoodItemPO : normoodItemPOs) {

			normoodItem = new NormoodItemVO(new GoodsVO());

			BeanUtil.copyProperties(normoodItemPO, normoodItem, Arrays.asList("goods"));
			BeanUtil.copyPropertie(normoodItemPO.getGoods(), normoodItem.getGoods(), Arrays.asList("accessoriesType"));

			normoodItemVOs.add(normoodItem);
		}

		return normoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<NormoodItemVO> addNormoodItem(QuotationVO quotationVO, List<NormoodItemVO> normoodItemVOs) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		List<NormpackItemPO> normpackItems = new ArrayList<NormpackItemPO>();

		for (NormoodItemVO normoodItemVO : normoodItemVOs) {

			List<NormpackItemPO> normpackItemPOs = normpackItemDaoImpl.queryNormpackItem(normoodItemVO.getSid());

			normpackItems.addAll(normpackItemPOs);
		}

		normoodItemVOs = new ArrayList<NormoodItemVO>();

		for (NormpackItemPO normpackItemPO : normpackItems) {

			NormoodItemPO normoodItemPO = new NormoodItemPO();

			normoodItemPO.setQid(quotationPO.getQid());
			normoodItemPO.setSid(quotationPO.getQid());

			normoodItemPO.setType(NormoodItemPO.TYPE_OFFER_INT);
			normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_PACK_INT);
			normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);

			normoodItemPO.setGoods(new GoodsPO(normpackItemPO.getGoods().getGid()));

			normoodItemPO.setNormunit(normpackItemPO.getNormunit());
			normoodItemPO.setNormnum(normpackItemPO.getNormnum());
			normoodItemPO.setStoreunit(normpackItemPO.getStoreunit());
			normoodItemPO.setStorenum(normpackItemPO.getStorenum());
			normoodItemPO.setGoods(normpackItemPO.getGoods());

			normoodItemDao.save(normoodItemPO);

			NormoodItemVO normoodItemVO = new NormoodItemVO(new GoodsVO());

			BeanUtil.copyProperties(normoodItemPO, normoodItemVO, Arrays.asList("goods"));
			BeanUtil.copyPropertie(normoodItemPO.getGoods(), normoodItemVO.getGoods(), Arrays.asList("accessoriesType"));

			normoodItemVOs.add(normoodItemVO);
		}

		return normoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormoodItem(NormoodItemVO normoodItemVO) throws FLException {

		NormoodItemPO normoodItemPO = normoodItemDao.get(normoodItemVO.getNgiid());

		if (normoodItemPO == null) {

		}

		normoodItemDao.delete(normoodItemPO);

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
