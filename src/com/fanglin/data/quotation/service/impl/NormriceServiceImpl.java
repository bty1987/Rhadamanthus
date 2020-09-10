package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.communion.vo.ConstructionNodeVO;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.NormriceDao;
import com.fanglin.data.quotation.service.NormriceService;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Service("normriceService")
@Transactional(readOnly = true)
public class NormriceServiceImpl implements NormriceService {

	@Autowired
	NormriceDao normriceDao;

	@Override
	public List<NormriceVO> queryNormriceByQiid(Long qiid) {

		List<NormricePO> normricePOs = normriceDao.queryNormriceByQiid(qiid);
		List<NormriceVO> normriceVOs = new ArrayList<NormriceVO>();

		for (NormricePO normricePO : normricePOs) {

			NormriceVO normriceVO = new NormriceVO(new ConstructionNodeVO(), new QuotationItemVO());

			QuotationItemPO quotationItemPO = normricePO.getQuotationItem();

			BeanUtil.copyProperties(normricePO, normriceVO, Arrays.asList("constructionNode", "quotationItem"));
			BeanUtil.copyProperties(normricePO.getConstructionNode(), normriceVO.getConstructionNode());
			BeanUtil.copyProperties(normricePO.getQuotationItem(), normriceVO.getQuotationItem(), Arrays.asList(QuotationItemPO.COLUMN_ARRAYS_STR));

			normriceVO.getQuotationItem().setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
			normriceVO.getQuotationItem().setWorkType(quotationItemPO.getWorkType().getName());

			normriceVOs.add(normriceVO);
		}

		return normriceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormrice(NormriceVO normriceVO) {

		NormricePO normricePO = new NormricePO(new QuotationItemPO(), new ConstructionNodePO());

		BeanUtil.copyPropertie(normriceVO, normricePO, Arrays.asList("constructionNode", "quotationItem"));
		BeanUtil.copyProperties(normriceVO.getConstructionNode(), normricePO.getConstructionNode());
		BeanUtil.copyProperties(normriceVO.getQuotationItem(), normricePO.getQuotationItem(), Arrays.asList(QuotationItemPO.COLUMN_ARRAYS_STR));

		normricePO.setStatus(NormricePO.STATUS_VALID_STR);

		normriceDao.save(normricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormrice(NormriceVO normriceVO) {

		normriceDao.deleteById(normriceVO.getNpid());

		return 0;
	}

}
