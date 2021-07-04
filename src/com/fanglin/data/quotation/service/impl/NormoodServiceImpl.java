package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.NormoodDao;
import com.fanglin.data.quotation.service.NormoodService;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Service("normoodService")
@Transactional(readOnly = true)
public class NormoodServiceImpl implements NormoodService {

	@Autowired
	NormoodDao normoodDao;

	@Override
	public List<NormoodVO> queryNormoodByQiid(Long qiid) {

		List<NormoodPO> normoodPOs = normoodDao.queryNormoodByQiid(qiid);
		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (NormoodPO normoodPO : normoodPOs) {

			NormoodVO normoodVO = new NormoodVO(new GoodsVO(), new QuotationItemVO(null, null, null, null, null, new WorkTypeVO(), new MeasurementUnitVO()));

			BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(normoodPO.getGoods(), normoodVO.getGoods(), Arrays.asList("accessoriesType"));

			normoodPO.getQuotationItem().ptv(normoodVO.getQuotationItem());

			normoodVOs.add(normoodVO);
		}

		return normoodVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormood(NormoodVO normoodVO) {

		NormoodPO normoodPO = new NormoodPO(new QuotationItemPO(), new GoodsPO());

		BeanUtil.copyPropertie(normoodVO, normoodPO, Arrays.asList("goods", "quotationItem"));
		BeanUtil.copyProperties(normoodVO.getGoods(), normoodPO.getGoods(), Arrays.asList("accessoriesType"));

		normoodPO.setQuotationItem(new QuotationItemPO(normoodVO.getQuotationItem().getQiid()));

		normoodPO.setStatus(NormoodPO.STATUS_VALID_STR);

		normoodDao.save(normoodPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormood(NormoodVO normoodVO) {

		normoodDao.deleteById(normoodVO.getNgid());

		return 0;
	}

}
