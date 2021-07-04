/**
 * @File Name		: QuotationFunctionAreaServiceImpl.java
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
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationNormoodDao;
import com.fanglin.quotation.dao.QuotationNormriceDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemAO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemMO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.service.QuotationNormService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationNormService")
@Transactional(readOnly = true)
public class QuotationNormServiceImpl implements QuotationNormService {

	@Autowired
	private QuotationNormoodDao quotationNormoodDao;

	@Autowired
	private QuotationNormriceDao quotationNormriceDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationNormood(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<?> quotationFunctionAreaItemAOs = quotationNormoodDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object quotationFunctionAreaItemAO : quotationFunctionAreaItemAOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemAO;

				QuotationFunctionAreaItemAO item = (QuotationFunctionAreaItemAO) data[0];
				NormoodPO normoodPO = (NormoodPO) data[1];
				GoodsPO goodsPO = (GoodsPO) data[2];

				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO(new NormoodVO(new GoodsVO(), null));

				BeanUtil.copyProperties(item, quotationFunctionAreaItemVO, Arrays.asList("normood", "normrice"));

				BeanUtil.copyProperties(normoodPO, quotationFunctionAreaItemVO.getNormood(), Arrays.asList("goods", "quotationItem"));
				BeanUtil.copyProperties(goodsPO, quotationFunctionAreaItemVO.getNormood().getGoods(), Arrays.asList("accessoriesType"));

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationNormrice(QuotationVO quotationVO, Short schedule) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<?> quotationFunctionAreaItemMOs = quotationNormriceDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId(), schedule);

			for (Object quotationFunctionAreaItemMO : quotationFunctionAreaItemMOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemMO;

				QuotationFunctionAreaItemMO item = (QuotationFunctionAreaItemMO) data[0];
				NormricePO normricePO = (NormricePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO(new NormriceVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(item, quotationFunctionAreaItemVO, Arrays.asList("normood", "normrice"));

				BeanUtil.copyProperties(normricePO, quotationFunctionAreaItemVO.getNormrice(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, quotationFunctionAreaItemVO.getNormrice().getConstructionNode());

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	public List<NormoodVO> amountQuotationNormood(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			List<?> normoods = quotationNormoodDao.amountQuotationNormood(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object normood : normoods) {

				Object[] data = (Object[]) normood;

				NormoodPO normoodPO = (NormoodPO) data[0];
				GoodsPO goodsPO = (GoodsPO) data[1];
				Long amount = (Long) data[2];

				NormoodVO normoodVO = new NormoodVO(new GoodsVO(), null);

				BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("goods", "quotationItem"));
				BeanUtil.copyProperties(goodsPO, normoodVO.getGoods(), Arrays.asList("accessoriesType"));

				normoodVO.setAmount(amount);

				normoodVOs.add(normoodVO);
			}
		}

		return normoodVOs;
	}

	@Override
	public List<NormriceVO> amountQuotationNormrice(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		List<NormriceVO> normriceVOs = new ArrayList<NormriceVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			List<?> normrices = quotationNormriceDao.amountQuotationNormrice(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object normrice : normrices) {

				Object[] data = (Object[]) normrice;

				NormricePO normricePO = (NormricePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Long amount = (Long) data[2];

				NormriceVO normriceVO = new NormriceVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normricePO, normriceVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normriceVO.getConstructionNode(), Arrays.asList("accessoriesType"));

				normriceVO.setAmount(amount);

				normriceVOs.add(normriceVO);
			}
		}

		return normriceVOs;
	}

}
