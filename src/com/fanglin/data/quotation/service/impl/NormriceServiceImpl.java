package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
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

			NormriceVO normriceVO = new NormriceVO(new ConstructionNodeVO(), new QuotationItemVO(null, null, null, null, null, new WorkTypeVO(), new MeasurementUnitVO()));

			BeanUtil.copyProperties(normricePO, normriceVO, Arrays.asList("constructionNode", "quotationItem"));
			BeanUtil.copyProperties(normricePO.getConstructionNode(), normriceVO.getConstructionNode());

			normricePO.getQuotationItem().ptv(normriceVO.getQuotationItem());

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

		normricePO.setQuotationItem(new QuotationItemPO(normriceVO.getQuotationItem().getQiid()));

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
